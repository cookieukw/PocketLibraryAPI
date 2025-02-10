"use client"
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface IMediaSelectionMenuProps {
  onMediaTypeChange: (selectedMediaType: number) => void;
  setSelectedMediaType: React.Dispatch<React.SetStateAction<number>>;
  selectedMediaType: number;
}

const mediaOptions = [
  { value: 5, label: "Imagem" },
  { value: 3, label: "Som" },
  { value: 2, label: "Texto" },
  { value: 6, label: "Vídeo" },
];

const MediaSelectionMenu: React.FC<IMediaSelectionMenuProps> = ({
  onMediaTypeChange,
  setSelectedMediaType,
  selectedMediaType,
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setSelectedMediaType(value);
    onMediaTypeChange(value);
  };

  return (
    <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="media-select-label">Tipo de Mídia</InputLabel>
      <Select
      color="primary"
        labelId="media-select-label"
        value={selectedMediaType}
        label="Tipo de Mídia"
        onChange={handleChange}
      >
        {mediaOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MediaSelectionMenu;