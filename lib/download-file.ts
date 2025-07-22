import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Http } from "@capacitor-community/http";

function getExtension(mime: string, url?: string) {
  const mimeToExtension: Record<string, string> = {
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/html": "html",
    "application/epub+zip": "epub",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "video/mp4": "mp4",
  };

  const extFromMime = mimeToExtension[mime.toLowerCase()];
  if (extFromMime) return extFromMime;

  if (url) {
    const match = url.match(/\.(\w{2,5})(\?.*)?$/);
    if (match) return match[1];
  }

  return "bin";
}


export async function handleDownloadFile(url: string, fileName = "arquivo", fileExtension: string) {
    console.log("arquivo")
  if (Capacitor.isNativePlatform()) {
    try {
      const response = await Http.request({
        method: "GET",
        url,
        responseType: "arraybuffer",
        headers: { Accept: "*/*" },
      });

      const fullName = `${fileName}.${fileExtension}`;

      const base64 = btoa(
        new Uint8Array(response.data)
          .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
      );

      await Filesystem.writeFile({
        path: fullName,
        data: base64,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      alert(`Salvo como ${fullName}`);
    } catch (err) {
      console.error("Erro no download mobile:", err);
      alert("Falha ao salvar o arquivo.");
    }
  } else {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
     
      const fullName = `${fileName}${fileExtension}`;

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fullName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erro no download web:", err);
      alert("Erro ao baixar o arquivo.");
    }
  }
}
