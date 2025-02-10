"use client";

import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from "@mui/material";
import { languageOptions } from "@/data/languages";

interface ILanguageSelectionProps {
    language: number;
    setLanguage: React.Dispatch<React.SetStateAction<number>>;
    onLanguageChange: (value: number) => void;
}

const LanguageSelection: React.FC<ILanguageSelectionProps> = ({
    language,
    setLanguage,
    onLanguageChange
}) => {
    const handleChange = (event: SelectChangeEvent<number>) => {
        const value = Number(event.target.value);
        setLanguage(value);
        onLanguageChange(value);
    };

    return (
        <FormControl fullWidth sx={{ minWidth: 200, m: 1 }}>
            <InputLabel id="language-select-label">Escolha o idioma</InputLabel>
            <Select
                color="primary"
                labelId="language-select-label"
                value={language}
                label="Escolha o idioma"
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300
                        }
                    }
                }}
            >
                {languageOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSelection;
