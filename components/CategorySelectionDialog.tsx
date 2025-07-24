// src/components/CategorySelectionDialog.tsx

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  DialogActions,
  Button,
  useMediaQuery,
  Theme,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';

// No seu projeto real, você provavelmente buscaria isso de uma API.
// Para este exemplo, vamos usar uma lista mocada.
const allCategories = [
  { id: 43, name: 'Romance' },
  { id: 1, name: 'Ficção Científica' },
  { id: 2, name: 'Fantasia' },
  { id: 3, name: 'Mistério' },
  { id: 4, name: 'Suspense' },
  { id: 5, name: 'Terror' },
  { id: 15, name: 'Aventura' },
  { id: 22, name: 'Biografia' },
  { id: 31, name: 'História' },
  // Adicione todas as outras categorias aqui
];

interface Props {
  open: boolean;
  selectedValue: number;
  onClose: () => void;
  onCategoryChange: (categoryId: number) => void;
}

const CategorySelectionDialog: React.FC<Props> = ({ open, selectedValue, onClose, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return allCategories;
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectCategory = (categoryId: number) => {
    onCategoryChange(categoryId);
    onClose(); // Fecha o dialog após a seleção
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Selecionar Categoria
        <IconButton onClick={onClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {filteredCategories.map((category) => (
            <ListItem key={category.id} disablePadding>
              <ListItemButton
                selected={selectedValue === category.id}
                onClick={() => handleSelectCategory(category.id)}
              >
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategorySelectionDialog;