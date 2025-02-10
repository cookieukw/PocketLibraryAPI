"use client";
import { useState, useEffect } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from "@mui/material";

interface ICategorySelectionMenuProps {
    onCategoryChange: (selectedValue: number) => void;
    selectedMediaType: number;
    setSelectedCategory: (value: number) => void;
    selectedCategory: number;
}

interface ICategoryItem {
    type: string;
    category: string;
    id: number;
}

const textCategoryList: ICategoryItem[] = [
    { type: "Texto", category: "Administração", id: 43 },
    { type: "Texto", category: "Agronomia", id: 69 },
    { type: "Texto", category: "Arquitetura", id: 89 },
    { type: "Texto", category: "Artes", id: 20 },
    { type: "Texto", category: "Astronomia", id: 68 },
    { type: "Texto", category: "Biologia Geral", id: 50 },
    { type: "Texto", category: "Ciência Política", id: 74 },
    { type: "Texto", category: "Ciência da Computação", id: 32 },
    { type: "Texto", category: "Ciência da Informação", id: 52 },
    { type: "Texto", category: "Ciências da Saúde", id: 48 },
    { type: "Texto", category: "Coleção Educadores", id: 133 },
    { type: "Texto", category: "Comunicação", id: 80 },
    { type: "Texto", category: "Conselho Nacional de Educação - CNE", id: 95 },
    { type: "Texto", category: "Defesa civil", id: 121 },
    { type: "Texto", category: "Direito", id: 21 },
    { type: "Texto", category: "Direitos humanos", id: 124 },
    { type: "Texto", category: "Economia", id: 73 },
    { type: "Texto", category: "Economia Doméstica", id: 39 },
    { type: "Texto", category: "Educação", id: 44 },
    { type: "Texto", category: "Educação - Trânsito", id: 40 },
    { type: "Texto", category: "Educação Física", id: 58 },
    { type: "Texto", category: "Engenharias", id: 59 },
    { type: "Texto", category: "Farmácia", id: 70 },
    { type: "Texto", category: "Filosofia", id: 54 },
    { type: "Texto", category: "Física", id: 61 },
    { type: "Texto", category: "Geociências", id: 97 },
    { type: "Texto", category: "Geografia", id: 82 },
    { type: "Texto", category: "História", id: 41 },
    { type: "Texto", category: "História Geral da África", id: 132 },
    { type: "Texto", category: "Legislação Educacional", id: 134 },
    { type: "Texto", category: "Literatura", id: 2 },
    { type: "Texto", category: "Literatura Infantil", id: 33 },
    { type: "Texto", category: "Literatura de Cordel", id: 35 },
    { type: "Texto", category: "Línguas", id: 81 },
    { type: "Texto", category: "Matemática", id: 67 },
    { type: "Texto", category: "Medicina", id: 65 },
    { type: "Texto", category: "Medicina Veterinária", id: 86 },
    { type: "Texto", category: "Meio Ambiente", id: 109 },
    { type: "Texto", category: "Meteorologia", id: 119 },
    { type: "Texto", category: "Multidisciplinar", id: 4 },
    { type: "Texto", category: "Música", id: 125 },
    { type: "Texto", category: "Psicologia", id: 30 },
    { type: "Texto", category: "Química", id: 66 },
    { type: "Texto", category: "Relações Internacionais", id: 129 },
    { type: "Texto", category: "Saúde Coletiva", id: 78 },
    { type: "Texto", category: "Serviço Social", id: 85 },
    { type: "Texto", category: "Sociologia", id: 62 },
    { type: "Texto", category: "Teologia", id: 17 },
    { type: "Texto", category: "Teses e Dissertações", id: 57 },
    { type: "Texto", category: "Trabalho", id: 122 },
    { type: "Texto", category: "Turismo", id: 123 }
];

const audioCategoryList: ICategoryItem[] = [
    { type: "Áudio", category: "Blues", id: 22 },
    { type: "Áudio", category: "Escola Brasil", id: 88 },
    { type: "Áudio", category: "Hinos", id: 5 },
    { type: "Áudio", category: "Jazz", id: 24 },
    { type: "Áudio", category: "Música Contemporânea", id: 18 },
    { type: "Áudio", category: "Música Erudita", id: 6 },
    { type: "Áudio", category: "Música Erudita Brasileira", id: 96 },
    { type: "Áudio", category: "Música Militar", id: 26 },
    { type: "Áudio", category: "Música Natalina", id: 7 },
    { type: "Áudio", category: "Música Regional", id: 27 },
    { type: "Áudio", category: "Pop Rock", id: 84 },
    { type: "Áudio", category: "Rádio Escola", id: 79 },
    { type: "Áudio", category: "Tome Ciência", id: 126 }
];

const videoCategoryList: ICategoryItem[] = [
    { type: "Vídeo", category: "Educação Ambiental", id: 131 },
    { type: "Vídeo", category: "FUNAG - Conferência", id: 12 },
    { type: "Vídeo", category: "FUNAG - Curso", id: 130 },
    {
        type: "Vídeo",
        category:
            "PROFORMAÇÃO - Programa de Formação de Professores em Exercício",
        id: 120
    },
    { type: "Vídeo", category: "Passeios Virtuais", id: 28 },
    { type: "Vídeo", category: "Religião", id: 118 },
    { type: "Vídeo", category: "TV Escola - Arte", id: 103 },
    { type: "Vídeo", category: "TV Escola - Ciências", id: 104 },
    { type: "Vídeo", category: "TV Escola - Com Ciência", id: 115 },
    { type: "Vídeo", category: "TV Escola - Como fazer? A Escola", id: 116 },
    { type: "Vídeo", category: "TV Escola - Educação Especial", id: 100 },
    { type: "Vídeo", category: "TV Escola - Educação Física", id: 101 },
    { type: "Vídeo", category: "TV Escola - Escola / Educação", id: 102 },
    { type: "Vídeo", category: "TV Escola - Fazendo Escola", id: 114 },
    { type: "Vídeo", category: "TV Escola - Geografia", id: 117 },
    { type: "Vídeo", category: "TV Escola - História", id: 106 },
    { type: "Vídeo", category: "TV Escola - Literatura", id: 108 },
    { type: "Vídeo", category: "TV Escola - Língua Portuguesa", id: 107 },
    { type: "Vídeo", category: "TV Escola - Matemática", id: 99 },
    { type: "Vídeo", category: "TV Escola - Pluralidade Cultural", id: 110 },
    { type: "Vídeo", category: "TV Escola - Sala de Professor", id: 113 },
    { type: "Vídeo", category: "TV Escola - Salto para o Futuro", id: 112 },
    { type: "Vídeo", category: "TV Escola - Saúde", id: 111 },
    { type: "Vídeo", category: "TV Escola - Ética", id: 105 }
];

const imageCategoryList: ICategoryItem[] = [
    { type: "Imagem", category: "Fotografia", id: 19 },
    { type: "Imagem", category: "Gravura", id: 38 },
    { type: "Imagem", category: "Ilustração", id: 8 },
    { type: "Imagem", category: "Litografia", id: 56 },
    { type: "Imagem", category: "Mapa", id: 9 },
    {
        type: "Imagem",
        category: "Pintura (uso educacional e não-comercial)",
        id: 10
    },
    { type: "Imagem", category: "Recortes", id: 36 },
    { type: "Imagem", category: "Satélite", id: 11 }
];

const CategorySelectionMenu: React.FC<ICategorySelectionMenuProps> = ({
    onCategoryChange,
    selectedMediaType,
    setSelectedCategory,
    selectedCategory
}) => {
    const [categories, setCategories] =
        useState<ICategoryItem[]>(textCategoryList);

    useEffect(() => {
        switch (selectedMediaType) {
            case 5: // Imagem
                setCategories(imageCategoryList);
                break;
            case 3: // Som
                setCategories(audioCategoryList);
                break;
            case 2: // Texto
                setCategories(textCategoryList);
                break;
            case 6: // Vídeo
                setCategories(videoCategoryList);
                break;
            default:
                setCategories(textCategoryList);
                break;
        }
    }, [selectedMediaType]);

    const handleCategoryChange = (event: SelectChangeEvent<number>) => {
        const value = Number(event.target.value);
        setSelectedCategory(value);
        onCategoryChange(value);
    };

    return (
        <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="category-select-label">
                Selecione a Categoria
            </InputLabel>
            <Select
                color="primary"
                labelId="category-select-label"
                value={selectedCategory}
                label="Selecione a Categoria"
                onChange={handleCategoryChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300
                        }
                    }
                }}
            >
                
                {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.category}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategorySelectionMenu;
