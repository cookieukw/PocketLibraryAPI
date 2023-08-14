import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import utils from "../../../classes/utils";
import axios from "axios";
import iconv from "iconv-lite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || !/^\d+$/.test(id)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing numeric ID parameter." });
  }

  const url = `http://www.dominiopublico.gov.br/pesquisa/DetalheObraForm.do?select_action=&co_obra=${id}`;

  const response = await axios.get(url);

  const decodedHtml = iconv.decode(response.data, "iso-8859-1");

  const $ = cheerio.load(decodedHtml);
  const bookInfo = {};
  const bookItems = [];
  $("table[width='100%'][border='0'][cellspacing='0'][cellpadding='0']")
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
    .filter(function () {
      return this.nodeType === 8;
    })
    .last()
    .each((_, e) => {
      let tempElement = $(e)[0].nodeValue.trim();
      tempElement = $(tempElement);
      tempElement = $(tempElement).find("a");
      bookItems.push(tempElement);
    });
  bookItems.filter((a) => String(a).trim());

  $(bookItems[0]).each((e) => {
    console.log($(e).html());
  });
  const tempUrl = $(bookItems[13]).attr("href");

  bookInfo.downloadUrl = tempUrl
    ? "http://www.dominiopublico.gov.br/download" + tempUrl
    : "";

  bookInfo.title = $(bookItems[0]).text();

  bookInfo.author = utils.clear($(bookItems[1]).text());
  bookInfo.category = utils.clear($(bookItems[2]).text()).toLowerCase();
  bookInfo.language = utils.clear($(bookItems[3]).text()).toLowerCase();
  bookInfo.intitutionOrPartner = utils.clear($(bookItems[4]).text());
  bookInfo.institutionOrProgram = utils.clear($(bookItems[5]).text());
  bookInfo.knowledgeArea = utils.clear($(bookItems[6]).text());
  bookInfo.level = utils.clear($(bookItems[7]).text());
  bookInfo.thesisYear = utils.clear($(bookItems[8]).text());
  bookInfo.acesses = utils.clear($(bookItems[9]).text());
  bookInfo.absctract = utils.clear($(bookItems[10]).text());

  if (Object.values(bookInfo).every((value) => value.trim() === "")) {
    return res.status(404).json({ error: "No data found for the given ID." });
  }

  Object.keys(bookInfo).forEach((key) => {
    if (bookInfo[key] === "") {
      bookInfo[key] = "informação indisponível";
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
