import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Http } from "@capacitor-community/http";

export async function handleDownloadFile(
  url: string,
  fileName = "arquivo",
  fileExtension: string
) {

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
        new Uint8Array(response.data).reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          ""
        )
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
