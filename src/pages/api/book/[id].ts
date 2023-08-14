import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import utils from "../../../classes/utils";
import axios from "axios";
import iconv from "iconv-lite";

interface BookInfo {
  downloadUrl: string;
  title: string;
  author: string;
  category: string;
  language: string;
  intitutionOrPartner: string;
  institutionOrProgram: string;
  knowledgeArea: string;
  level: string;
  thesisYear: string;
  accesses: string;
  abstract: string;
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
  const bookItems: any[] = [];
  const comments = $(
    "table[width='100%'][border='0'][cellspacing='0'][cellpadding='0']"
  )
    .eq(10)
    .find("table")
    .eq(1)
    .find("tr")
    .each((_, element) => {
      const item = $(element).find("td").eq(2);
      bookItems.push(item);
      console.log($(item).text());
    })
    .contents()
    .filter(function (this: any) {
      return this.nodeType === 8;
    })
    .last();
  /* .each((_, e: any) => {
      // let tempElement = $(e)[0].nodeValue!.trim();
      let tempElement = $(e).text().trim();
      tempElement = $(tempElement);
      tempElement = $(tempElement).find("a");
      bookItems.push(tempElement);
    });*/
  comments.each((_, e: any) => {
    let tempElement = e.nodeValue;
    tempElement = $(tempElement).find("a");

    bookItems.push(tempElement);
  });

  bookItems.filter((a: any) => String(a).trim());

  const tempUrl = $(bookItems[13]).attr("href") ??"";

  bookInfo.downloadUrl = tempUrl
    ? "http://www.dominiopublico.gov.br/download" + tempUrl
    : "";

  bookInfo.title = $(bookItems[0]).text()??"";

  bookInfo.author = utils.clear($(bookItems[1]).text()??"")??"";
  bookInfo.category = utils.clear($(bookItems[2]).text()??"")?.toLowerCase()??"";
  bookInfo.language = utils.clear($(bookItems[3]).text()??"")?.toLowerCase()   ??"";
  bookInfo.intitutionOrPartner = utils.clear($(bookItems[4]).text()??"")??"";
  bookInfo.institutionOrProgram = utils.clear($(bookItems[5]).text()??"")??"";
  bookInfo.knowledgeArea = utils.clear($(bookItems[6]).text()??"")??"";
  bookInfo.level = utils.clear($(bookItems[7]).text()??"")??"";
  bookInfo.thesisYear = utils.clear($(bookItems[8]).text()??"")??"";
  bookInfo.accesses = utils.clear($(bookItems[9]).text()??"")??"";
  bookInfo.abstract = utils.clear($(bookItems[10]).text()??  "")??"";

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
  res.status(200).json(bookInfo);
}
