export default {
   convertToBytes(sizeStr: string): number {
    const units: { [key: string]: number } = {
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024
    };

    const [valueStr, unit] = sizeStr.split(' ');

    const value = parseFloat(valueStr.replace(',', '.'));

    if (!units[unit]) {
        throw new Error('Unidade de tamanho desconhecida');
    }

    const bytesSize = Math.floor(value * units[unit]);

    return bytesSize;
}
,
  clear: (text) => {
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
        .replace("[cp]", "")
        .replace("(cp)", "")
        .replace("[", "")
        .split(/\s/g)
        .filter((e) => String(e).trim())
        .join(" ")
    );
  },
};
