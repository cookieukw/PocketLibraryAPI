// app/api/ebook/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import iconv from "iconv-lite";
import { translateKeys, clear } from "@/classes/util";

interface BookInfo {
    downloadUrl?: string;
    title?: string;
    author?: string;
    category?: string;
    language?: string;
    intitutionOrPartner?: string;
    institutionOrProgram?: string;
    knowledgeArea?: string;
    level?: string;
    thesisYear?: string;
    accesses?: string;
    abstract?: string;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json(
            { error: "Invalid or missing numeric ID parameter." },
            { status: 400 }
        );
    }

    try {
        const url = `http://www.dominiopublico.gov.br/pesquisa/DetalheObraForm.do?select_action=&co_obra=${id}`;

        const response = await axios.get(url);
        //@ts-ignore
        const decodedHtml = iconv.decode(response.data, "iso-8859-1");

        const $ = cheerio.load(decodedHtml);

        const bookInfo: BookInfo = {
            downloadUrl: "",
            title: "",
            author: "",
            category: "",
            language: "",
            intitutionOrPartner: "",
            institutionOrProgram: "",
            knowledgeArea: "",
            level: "",
            thesisYear: "",
            accesses: "",
            abstract: ""
        };

        const trashInfo: Record<string, any> = {};
        const tables = $(
            "table[width='100%'][border='0'][cellspacing='0'][cellpadding='0']"
        );

        const tableInfo = $(tables).eq(10).find("table").eq(1);

        $(tables)
            .eq(9)
            .find("tr")

            .each((_, a: any) => {
                const splitValue = $(a)
                    .text()
                    .split(":")
                    .map(item => String(item).trim())
                    .filter(item => String(item).trim());
            });

        $(tableInfo)
            .find("tr")
            .each((_, e: any) => {
                trashInfo[`${clear($(e).find(".detalhe1").text().trim())}`] = $(
                    e
                )
                    .find(".detalhe2")
                    .text()
                    .trim();
            })
            .last()
            .contents()
            .filter(function (this: any) {
                return this.nodeType === 8;
            })
            .last()
            .each((_, e: any) => {
                let tempElement = e.nodeValue;
                const tempUrl = $(tempElement).find("a").attr("href") ?? "";
                bookInfo.downloadUrl = tempUrl
                    ? "http://www.dominiopublico.gov.br/download" + tempUrl
                    : "";
            });

        const bookResults = translateKeys(trashInfo);

        Object.keys(bookInfo).forEach(key => {
            if (key == "downloadUrl") {
                return;
            }
            bookInfo[key as keyof BookInfo] =
                bookResults[key as keyof BookInfo];
        });

        

        Object.keys(bookInfo).forEach(key => {
            if (bookInfo[key as keyof BookInfo] === "") {
                bookInfo[key as keyof BookInfo] = "informação indisponível";
            }
        });

        const headers = new Headers({
            "Cache-Control": `max-age=${30 * 24 * 60 * 60}`,
            "CDN-Cache-Control": `public, s-maxage=${30 * 24 * 60 * 60}`,
            "Vercel-CDN-Cache-Control": `public, s-maxage=${30 * 24 * 60 * 60}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            "Access-Control-Allow-Headers":
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        });

        return NextResponse.json(bookInfo, { status: 200, headers });
    } catch (err: any) {
        console.error("Erro:", err);
        return NextResponse.json(
            { error: "Internal server error", message: err.message },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            "Access-Control-Allow-Headers":
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        }
    });
}
