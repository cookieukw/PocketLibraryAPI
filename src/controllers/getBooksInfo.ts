import axios from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";
import { NextApiRequest, NextApiResponse } from "next";
import headers from "../classes/headers";
import utils from "../classes/utils";
const clear = utils.clear;
const convertToBytes = utils.convertToBytes;

export default async function getBooksInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    itemsSize,
    skipItems,
    title,
    authorName,
    codeAuthor,
    category,
    page,
    media,
    artwork,
    language,
    filterBy,
    order,
  } = req.query;

  const params = {
    itemsSize: Number(itemsSize) || 10,
    skipItems: Number(skipItems) || 0,
    title: title || "",
    authorName: authorName || "",
    codeAuthor: codeAuthor || "",
    category: category || "",
    page: Number(page) || 2,
    media: Number(media) || 2,
    artwork: artwork || "",
    language: Number(language) || 1,
    filterBy: filterBy || null,
    order: order || null,
  };

  const queryUrl = `http://www.dominiopublico.gov.br/pesquisa/ResultadoPesquisaObraForm.do?first=${params.itemsSize}&skip=${params.skipItems}&ds_titulo=${params.title}&co_autor=${params.codeAuthor}&no_autor=${params.authorName}&co_categoria=${params.category}&pagina=${params.page}&select_action=Submit&co_midia=${params.media}&co_obra=${params.artwork}&co_idioma=${params.language}&colunaOrdenar=${params.filterBy}&ordem=${params.order}`;

  const response = await axios.get(queryUrl, {
    headers,
    responseType: "arraybuffer",
  });

  const decodedHtml = iconv.decode(response.data, "iso-8859-1");

  const $ = cheerio.load(decodedHtml, {
    decodeEntities: true,
    xmlMode: true,
    xml: {
      normalizeWhitespace: true,
    },
  });

  const bookList: Array<{
    title: string;
    author: string;
    font: string;
    link: string;
    size: string;
    sizeByBytes: number;
    format: string;
  }> = [];
  const table = $("#res").find("tbody");
  const books = $(table).find("tr");

  books.each((index, element) => {
    const title = clear($(element).find("td:nth-child(3) a").text());

    const author = clear($(element).find("td:nth-child(4)").text().trim());

    const font = clear($(element).find("td:nth-child(5)").text().trim());

    const link = clear($(element).find("td:nth-child(2) a").attr("href"));

    const size = clear($(element).find("td:nth-child(7)").text().trim());

    const sizeByBytes = convertToBytes(size);

    const format = clear($(element).find("td:nth-child(6)").text().trim());

    if (title && author && link && size && format) {
      bookList.push({
        title,
        author,
        font,
        id: link.match(/co_obra=(\d+)/)[1],
        size,
        sizeByBytes,
        format,
      });
    }
  });

  const oneMonthInSeconds = 30 * 24 * 60 * 60;

  res.setHeader("Cache-Control", `max-age=${oneMonthInSeconds}`);
  res.setHeader("CDN-Cache-Control", `public, s-maxage=${oneMonthInSeconds}`);
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    `public, s-maxage=${oneMonthInSeconds}`
  );
 
  res.status(200).json(bookList);
}
