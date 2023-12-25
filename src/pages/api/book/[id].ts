import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import utils from "../../../classes/utils";
import axios from "axios";
import iconv from "iconv-lite";
const l = console.log;

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || !/^\d+$/.test(id as string)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing numeric ID parameter." });
  }

  const url = `http://www.dominiopublico.gov.br/pesquisa/DetalheObraForm.do?select_action=&co_obra=${id}`;

  const response = await axios.get(url);

  const decodedHtml = iconv.decode(response.data, "iso-8859-1");
  for (let i = 0; i < 50; i++) {
    l("\n");
  }
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
    abstract: "",
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
      l($(a).html());
      const splitValue = $(a)
        .text()
        .split(":")
        .map((item) => String(item).trim())
        .filter((item) => String(item).trim());

      l(
        `
      {"${utils.clear(splitValue[0])}": "${splitValue[1]}" }
      `
      );
    });

  $(tableInfo)
    .find("tr")
    .each((_, e: any) => {
      trashInfo[`${utils.clear($(e).find(".detalhe1").text().trim())}`] = $(e)
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
  const bookResults = utils.translateKeys(trashInfo);

  Object.keys(bookInfo).forEach((key) => {
    if (key == "downloadUrl") {
      return;
    }
    bookInfo[key as keyof BookInfo] = bookResults[key as keyof BookInfo];
  });

  if (Object.values(bookInfo).every((value) => value.trim() === "")) {
    return res.status(404).json({ error: "No data found for the given ID." });
  }

  Object.keys(bookInfo).forEach((key) => {
    if (bookInfo[key as keyof BookInfo] === "") {
      bookInfo[key as keyof BookInfo] = "informação indisponível";
    }
  });

  const oneMonthInSeconds = 30 * 24 * 60 * 60;
  res.setHeader("Cache-Control", `max-age=${oneMonthInSeconds}`);
  res.setHeader("CDN-Cache-Control", `public, s-maxage=${oneMonthInSeconds}`);
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    `public, s-maxage=${oneMonthInSeconds}`
  );

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  res.status(200).json(bookInfo);
}
