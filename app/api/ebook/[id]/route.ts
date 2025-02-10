import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

import axios from "axios";
import iconv from "iconv-lite";
import {keyMap} from "@/classes/util"
type BookInfo = {
    downloadUrl?: string;
    title?: string;
    author?: string;
    category?: string;
    language?: string;
    institutionOrPartner?: string;
    institutionOrProgram?: string;
    knowledgeArea?: string;
    level?: string;
    thesisYear?: string;
    accesses?: string;
    abstract?: string;
};


export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") ?? "";

    if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json(
            { error: "Invalid or missing numeric ID parameter." },
            { status: 400 }
        );
    }

    try {
        const url = `http://www.dominiopublico.gov.br/pesquisa/DetalheObraForm.do?select_action=&co_obra=${id}`;
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const decodedHtml = iconv.decode(
            Buffer.from(response.data),
            "iso-8859-1"
        );
        const $ = cheerio.load(decodedHtml);

        const bookInfo: BookInfo = {};
        const mainTable = $(
            'table[width="100%"][cellspacing="0"][cellpadding="0"]'
        ).eq(10);

        // Extrair informações principais
        mainTable.find("tr").each((_, element) => {
            const key = $(element).find(".detalhe1").text().trim();
            const value = $(element).find(".detalhe2").text().trim();
            if (key && keyMap[key]) {
                bookInfo[keyMap[key]] = value;
            }
        });

        // Extrair URL de download
        const downloadComment = mainTable
            .find("tr")
            .last()
            .contents()
            .filter((_, node) => node.nodeType === 8)
            .toString();

        const downloadPath = downloadComment.match(/href="(.*?)"/)?.[1] || "";
        bookInfo.downloadUrl = downloadPath
            ? `http://www.dominiopublico.gov.br/download${downloadPath}`
            : "";

        // Tratar campos vazios
        Object.entries(bookInfo).forEach(([key, value]) => {
            if (!value) {
                bookInfo[key as keyof BookInfo] = "informação indisponível";
            }
        });

        // Configurar cabeçalhos de cache
        const headers = new Headers({
            "Cache-Control": `public, max-age=${30 * 24 * 60 * 60}`,
            "CDN-Cache-Control": `public, s-maxage=${30 * 24 * 60 * 60}`,
            "Vercel-CDN-Cache-Control": `public, s-maxage=${30 * 24 * 60 * 60}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        });

        return NextResponse.json(bookInfo, { headers });
    } catch (error) {
        console.error("Error fetching book info:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export const OPTIONS = async () => {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
};
