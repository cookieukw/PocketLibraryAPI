const keyMap: Record<string, string> = {
  titulo: "title",
  autor: "author",
  categoria: "category",
  idioma: "language",
  instituicao_parceiro: "intitutionOrPartner",
  instituicao_programa: "institutionOrProgram",
  area_conhecimento: "knowledgeArea",
  nivel: "level",
  ano_da_tese: "thesisYear",
  acessos: "accesses",
  resumo: "abstract",
};

export default {
  convertToBytes(sizeStr: string): number {
    const units: { [key: string]: number } = {
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const [valueStr, unit] = sizeStr.split(" ");

    const value = parseFloat(valueStr.replace(",", "."));

    if (!units[unit]) {
      throw new Error("Unidade de tamanho desconhecida");
    }

    const bytesSize = Math.floor(value * units[unit]);

    return bytesSize;
  },
  clear: (text: string | undefined) => {
    if (!text) return null;
    return (
      text
        .trim()
        // .replace(/-/g,"")
        .replace(":", "")
        .replace("/", " ")
        //.replace("\\"," ")
        // .toLowerCase()
        .replaceAll(/"/g, '\\"')
        //.replaceAll(/\(.*\)/g, '')
        // .replaceAll(/\[.*\]/g, '')

        .split(/\s/g)
        .filter((e) => String(e).trim())
        .join("_")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );
  },
  translateKeys(data: Record<string, any>): Record<string, any> {
    const translatedData = {};
    for (const key in data) {
      if (keyMap.hasOwnProperty(key)) {
        translatedData[keyMap[key]] = data[key];
      }
    }
    return translatedData;
  },
};
