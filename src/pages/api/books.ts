import { NextApiRequest, NextApiResponse } from "next";
import getBooksInfo from "../../controllers/getBooksInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getBooksInfo(req, res);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
