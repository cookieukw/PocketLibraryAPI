// app/api/ebook/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import axios from "axios"; // Importando axios para requisições HTTP
import { decode } from "html-entities";
import { clear, translateKeys } from "@/classes/utils";




// --- Tipos e Constantes ---

interface BookInfo {
  downloadUrl: string;
  title: string;
  author: string;
  category: string;
  language: string;
  institutionOrPartner: string;
  institutionOrProgram: string;
  knowledgeArea: string;
  level: string;
  thesisYear: string;
  accesses: string;
  abstract: string;
}

// Centraliza os headers de CORS para reutilização e fácil manutenção.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

// --- Lógica da Rota ---

/**
 * Handler para requisições GET.
 * Realiza o scraping da página de detalhes de uma obra no site Domínio Público.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Validação robusta do ID.
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "Parâmetro de ID numérico inválido ou ausente." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const url = `http://www.dominiopublico.gov.br/pesquisa/DetalheObraForm.do?select_action=&co_obra=${id}`;

    // Usando Axios com responseType 'arraybuffer' para obter os dados brutos.
    const response = await axios.get(url);

    // Decodificando o buffer com 'iconv-lite' para garantir a correta interpretação dos caracteres.

    const isoBuffer = Buffer.from(response.data, "binary");
    const decodedHtml = iconv.decode(isoBuffer, "iso-8859-1");
    const $ = cheerio.load(decodedHtml);

    // --- Extração de Dados ---

    const rawBookData: Record<string, string> = {};
    let downloadUrl = "";

    // Lógica de extração mantida conforme a versão funcional para garantir estabilidade.
    const tables = $(
      "table[width='100%'][border='0'][cellspacing='0'][cellpadding='0']"
    );
    const infoTable = tables.eq(10).find("table").eq(1);

    // 1. Extrai os detalhes principais da obra (título, autor, etc.).
    infoTable.find("tr").each((_, element) => {
      const key = clear($(element).find(".detalhe1").text());
      const value = $(element).find(".detalhe2").text().trim();
      if (key && value) {
        rawBookData[key] = value;
      }
    });
    console.log("Dados brutos extraídos:", rawBookData);
    // 2. Extrai o resumo, que está em uma estrutura separada.
    const abstract = infoTable
      .find("tr > td[valign='top'] > span.detalhe2")
      .text()
      .trim();
    if (abstract) {
      rawBookData["Resumo"] = abstract;
    }

    console.log("Resumo extraído:", abstract);
    // 3. Extrai a URL de download, que está escondida dentro de um comentário HTML.
    infoTable
      .find("tr")

      .last()
      .contents()
      .filter(function (this: any) {
        return this.nodeType === 8;
      })
      .last()
      .each((_, e: any) => {
        let tempElement = e.nodeValue;
        const tempUrl = $(tempElement).find("a").attr("href") ?? "";
        downloadUrl = tempUrl
          ? "http://www.dominiopublico.gov.br/download" + tempUrl
          : "";
      });

    console.log("URL de download extraída:", downloadUrl);
    // --- Montagem do Objeto Final ---

    const translatedData = translateKeys(rawBookData);
    const unavailable = null;

    const bookInfo: BookInfo = {
      downloadUrl: decode(downloadUrl) || unavailable,
      title: decode(translatedData.title) || unavailable,
      author: decode(translatedData.author) || unavailable,
      category: decode(translatedData.category) || unavailable,
      language: decode(translatedData.language) || unavailable,
      institutionOrPartner:
        decode(translatedData.intitutionOrPartner) || unavailable,
      institutionOrProgram:
        decode(translatedData.institutionOrProgram) || unavailable,
      knowledgeArea: decode(translatedData.knowledgeArea) || unavailable,
      level: decode(translatedData.level) || unavailable,
      thesisYear: decode(translatedData.thesisYear) || unavailable,
      accesses: decode(translatedData.accesses) || unavailable,
      abstract: decode(translatedData.abstract) || unavailable,
    };

    // Define headers de cache para otimizar a entrega via CDN (como a da Vercel).
    const cacheSeconds = 30 * 24 * 60 * 60; // 30 dias
    const headers = {
      ...corsHeaders,
      "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate`,
    };

    return NextResponse.json(bookInfo, { status: 200, headers });
  } catch (err: any) {
    console.error("Erro na rota /api/ebook/[id]:", err);

    // Tratamento de erro aprimorado para Axios
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          error: "Erro ao se comunicar com a fonte de dados.",
          message: err.message,
        },
        { status: err.response?.status || 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor.",
        message: err.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Handler para requisições OPTIONS (pre-flight).
 * Necessário para permitir requisições de origens diferentes (CORS).
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
