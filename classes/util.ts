import {
    Description,
    Image,
    Movie,
    MusicNote,
    PlayCircleOutline,
    InsertDriveFile
} from "@mui/icons-material";

type IconComponent = React.ComponentType<any>;

export const getIcon = (format: string): IconComponent => {
    const formatLower = format.toLowerCase();

    // Documentos
    if (
        formatLower === "pdf" ||
        formatLower === "doc" ||
        formatLower === "docx"
    ) {
        return Description;
    }

    // Imagens
    if (["jpg", "jpeg", "png", "gif"].includes(formatLower)) {
        return Image;
    }

    // Vídeos
    if (["mp4", "avi", "mkv"].includes(formatLower)) {
        return Movie;
    }

    // Áudios
    if (["mp3", "wav", "ogg"].includes(formatLower)) {
        return MusicNote;
    }

    // Texto puro
    if (formatLower === "txt") {
        return InsertDriveFile;
    }

    // Padrão para outros formatos
    return PlayCircleOutline;
};

export const keyMap: Record<string, string> = {
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
    resumo: "abstract"
};

export const toCamelCase = (text: string): string => {
    return text
        .toLowerCase()
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export async function initializeADS(): Promise<void> {}

export const convertToBytes = (sizeStr: string) => {
    const units: { [key: string]: number } = {
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024
    };

    const [valueStr, unit] = sizeStr.trim().toLocaleUpperCase().split(" ");

    const value = parseFloat(valueStr.replace(",", "."));

    if (!units[unit]) {
        console.log("Unidade de tamanho desconhecida");
    }

    const bytesSize = Math.floor(value * units[unit]);

    return bytesSize;
};

export const clear = (text: string | undefined) => {
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
            .filter(e => String(e).trim())
            .join(" ")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
    );
};

export const translateKeys = (
    data: Record<string, any>
): Record<string, any> => {
    let translatedData: Record<string, any> = {};
    for (const key in data) {
        if (keyMap.hasOwnProperty(key)) {
            translatedData[keyMap[key]] = data[key];
        }
    }
    return translatedData;
};