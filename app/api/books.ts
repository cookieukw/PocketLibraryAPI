import axios from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";
import { NextResponse } from "next/server";

import headersConfig from "@/classes/headers";


import { clear, convertToBytes } from "@/classes/util";



export async function GET(request: Request) {
    // Definindo os cabeçalhos CORS e de cache para a resposta
    const corsHeaders = new Headers();
    corsHeaders.set("Access-Control-Allow-Origin", "*");
    corsHeaders.set(
        "Access-Control-Allow-Methods",
        "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    corsHeaders.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    // Extrai os parâmetros da query string da URL
    const { searchParams } = new URL(request.url);
    const itemsSize = Number(searchParams.get("itemsSize")) || 10;
    const skipItems = Number(searchParams.get("skipItems")) || 0;
    const title = searchParams.get("title") || "";
    const authorName = searchParams.get("authorName") || "";
    const codeAuthor = searchParams.get("codeAuthor") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 2;
    const media = Number(searchParams.get("media")) || 2;
    const artwork = searchParams.get("artwork") || "";
    const language = Number(searchParams.get("language")) || 1;
    const filterBy = searchParams.get("filterBy") || "";
    const order = searchParams.get("order") || "";

    // Constrói a URL de consulta para o serviço externo
    const queryUrl = `http://www.dominiopublico.gov.br/pesquisa/ResultadoPesquisaObraForm.do?first=${itemsSize}&skip=${skipItems}&ds_titulo=${title}&co_autor=${codeAuthor}&no_autor=${authorName}&co_categoria=${category}&pagina=${page}&select_action=Submit&co_midia=${media}&co_obra=${artwork}&co_idioma=${language}&colunaOrdenar=${filterBy}&ordem=${order}`;
    //console.log({ queryUrl });

    try {
        // Faz a requisição usando axios (usando headersConfig, que você pode customizar conforme necessário)
        const response = await axios.get(queryUrl, {
            headers: headersConfig,
            responseType: "arraybuffer"
        });

        // Converte o HTML recebido (em iso-8859-1) para UTF-8
        const decodedHtml = iconv.decode(response.data, "iso-8859-1");

        // Carrega o HTML com cheerio para facilitar a extração dos dados
        const $ = cheerio.load(decodedHtml, {
            
            xmlMode: true
        });

        // Define a interface para cada livro
        interface IBook {
            title: string;
            author: string;
            font: string;
            link: string;
            size: string;
            sizeByBytes: string;
            format: string;
            bookId: string;
        }

        const bookList: IBook[] = [];
        const table = $("#res").find("tbody");
        const books = $(table).find("tr");

        // Percorre cada linha da tabela e extrai os dados do livro
        books.each((index, element) => {
            const newBook: IBook = {
                title: "",
                author: "",
                font: "",
                link: "",
                size: "",
                sizeByBytes: "",
                format: "",
                bookId: ""
            };

            newBook.title =
                clear($(element).find("td:nth-child(3) a").text() ?? "") ?? "";
            newBook.author =
                clear($(element).find("td:nth-child(4)").text().trim() ?? "") ??
                "";
            newBook.font =
                clear($(element).find("td:nth-child(5)").text().trim() ?? "") ??
                "";
            newBook.link =
                $(element)
                    .find("td:nth-child(2) a")
                    .attr("href")
                    ?.substring(3) ?? "";
            newBook.link = newBook.link
                ? "http://www.dominiopublico.gov.br/" + newBook.link
                : "";
            newBook.size =
                clear($(element).find("td:nth-child(7)").text().trim() ?? "") ??
                "";
            newBook.sizeByBytes =
                convertToBytes(newBook.size ?? "").toString() ?? "";
            newBook.format =
                clear($(element).find("td:nth-child(6)").text().trim() ?? "") ??
                "";
            const matchResult = newBook.link?.match(/co_obra=(\d+)/);
            newBook.bookId = matchResult ? matchResult[1] : "";

            // Só adiciona à lista se o título não estiver vazio
            if (newBook.title.trim() !== "") {
                // Se algum campo estiver vazio, atribui "informação indisponível"
                Object.keys(newBook).forEach(key => {
                    const typedKey = key as keyof IBook;
                    if (newBook[typedKey] === "") {
                        newBook[typedKey] = "informação indisponível";
                    }
                });
                bookList.push(newBook);
            }
        });

        // Define cabeçalhos de cache para um mês
        const oneMonthInSeconds = 30 * 24 * 60 * 60;
        corsHeaders.set("Cache-Control", `max-age=${oneMonthInSeconds}`);
        corsHeaders.set(
            "CDN-Cache-Control",
            `public, s-maxage=${oneMonthInSeconds}`
        );
        corsHeaders.set(
            "Vercel-CDN-Cache-Control",
            `public, s-maxage=${oneMonthInSeconds}`
        );

        return new NextResponse(JSON.stringify(bookList), {
            headers: corsHeaders,
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}
