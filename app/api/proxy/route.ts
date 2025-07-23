import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const fileName = req.nextUrl.searchParams.get("name") || "arquivo";

  if (!url) return NextResponse.json({ error: "URL ausente" }, { status: 400 });

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const contentType = response.headers["content-type"] || "application/octet-stream";
    const extension = contentType.split("/")[1]?.split(";")[0] || "bin";

    const buffer = Buffer.from(response.data);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}.${extension}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Erro no proxy download:", err);
    return NextResponse.json({ error: "Falha ao baixar arquivo" }, { status: 500 });
  }
}
