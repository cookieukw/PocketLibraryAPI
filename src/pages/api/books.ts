import { NextApiRequest, NextApiResponse } from "next";
import getBooksInfo from "../../controllers/getBooksInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === "GET") {
    await getBooksInfo(req, res);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
