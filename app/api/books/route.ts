// api/books/route.ts
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import { clear, convertToBytes } from "@/classes/utils";

// --- Tipos e Constantes ---

interface IBook {
  bookId: string;
  title: string;
  author: string;
  font: string;
  format: string;
  size: string;
  sizeInBytes: number;
  detailsLink: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

const UNAVAILABLE_TEXT = "informação indisponível";

// --- Lógica da Rota ---

export async function GET(request: NextRequest) {
  try {
    // 1. Extração e construção segura dos parâmetros de busca
    const searchParams = request.nextUrl.searchParams;
    const params = new URLSearchParams({
      first: searchParams.get("itemsSize") || "10",
      skip: searchParams.get("skipItems") || "0",
      ds_titulo: searchParams.get("title") || "",
      no_autor: searchParams.get("authorName") || "",
      co_categoria: searchParams.get("category") || "",
      pagina: searchParams.get("page") || "1",
      co_midia: searchParams.get("media") || "2",
      co_idioma: searchParams.get("language") || "1",
      select_action: "Submit",
    });
    const queryUrl = `http://www.dominiopublico.gov.br/pesquisa/ResultadoPesquisaObraForm.do?${params.toString()}`;

    // 2. Requisição com Axios, tratando a resposta como buffer para decodificação correta
    const response = await axios.get(queryUrl, {
      responseType: "arraybuffer",
      timeout: 20000,
    });
    const decodedHtml = iconv.decode(response.data, "iso-8859-1");
    const $ = cheerio.load(decodedHtml);

    // --- Scraping Inteligente ---
    const table = $("#res");
    const bookList: IBook[] = [];

    // Mapeia os cabeçalhos para seus índices de coluna. Isso torna o scraper robusto.
    const headerMap: { [key: string]: number } = {};
    table.find("thead th").each((index, element) => {
      const headerText = $(element).text().trim().toLowerCase();
      if (headerText.includes("título")) headerMap["title"] = index;
      if (headerText.includes("autor")) headerMap["author"] = index;
      if (headerText.includes("fonte")) headerMap["font"] = index;
      if (headerText.includes("formato")) headerMap["format"] = index;
      if (headerText.includes("tamanho")) headerMap["size"] = index;
      if (headerText.includes("download")) headerMap["download"] = index;
    });

    // Itera sobre as linhas da tabela para extrair os dados de cada livro
    table.find("tbody tr").each((_, element) => {
      const $row = $(element);

      // Função auxiliar para obter texto da célula pelo nome do cabeçalho
      const getCellText = (headerName: keyof typeof headerMap) => {
        const index = headerMap[headerName];
        return index !== undefined
          ? clear($row.find(`td:nth-child(${index + 1})`).text())
          : UNAVAILABLE_TEXT;
      };

      // CORREÇÃO: Verifica se o índice da coluna existe antes de usá-lo no seletor.
      const titleIndex = headerMap["title"];
      if (titleIndex === undefined) {
        return; // Pula a linha se a coluna de título não for encontrada.
      }

      const title = clear($row.find(`td:nth-child(${titleIndex + 1})`).text());
      if (!title) {
        return; // Pula linhas inválidas ou de cabeçalho repetido
      }

   
      const detailsLink =
        "http://www.dominiopublico.gov.br/" +
        ($(element).find("td:nth-child(2) a").attr("href")?.substring(3) ??
          UNAVAILABLE_TEXT);

      const bookIdMatch = detailsLink.match(/co_obra=(\d+)/);

  


      const size =
        clear($(element).find("td:nth-child(7)").text().trim() ?? "") ?? "";

      bookList.push({
        bookId: bookIdMatch ? bookIdMatch[1] : UNAVAILABLE_TEXT,
        title,
        author: getCellText("author"),
        font: getCellText("font"),
        format: getCellText("format"),
        size,
        sizeInBytes: convertToBytes(size),
   
        detailsLink,
      });
    });

    // Extrai o número total de resultados para facilitar a paginação no frontend
    const totalText = $(".detalhe_total").text(); // "1 a 10 de 4503 itens"
    const totalMatch = totalText.match(/de\s*([\d\.]+)/);
    const totalResults = totalMatch
      ? parseInt(totalMatch[1].replace(/\./g, ""), 10)
      : 0;

    // 3. Retorna uma resposta JSON estruturada e correta
    const cacheSeconds = 60 * 60; // 1 hora de cache
    const headers = {
      ...CORS_HEADERS,
      "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate`,
    };

    return NextResponse.json(
      {
        total: totalResults,
        books: bookList,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Erro na rota /api/books:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Erro ao se comunicar com a fonte de dados.",
          message: error.message,
        },
        { status: error.response?.status || 500, headers: CORS_HEADERS }
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
