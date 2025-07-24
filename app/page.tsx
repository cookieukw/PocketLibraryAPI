"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  List,
  CircularProgress,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Accordion, // NOVO
  AccordionSummary, // NOVO
  AccordionDetails, // NOVO
  IconButton, // NOVO
} from "@mui/material";
import {
  Search,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from "@mui/icons-material"; // NOVO
import axios from "axios";
import dynamic from "next/dynamic";
import InfiniteScroll from "react-infinite-scroll-component";

// Componentes da aplicação
import BookItem from "@/components/BookItem";
import BookItemSkeleton from "@/components/BookItemSkeleton";
import CategorySelectionDialog from "@/components/CategorySelectionDialog";
import animation404 from "@/lottie/no_data.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// --- Interfaces e Tipos ---
interface Book {
  title: string;
  author: string;
  font: string;
  size: string;
  sizeByBytes: string;
  format: string;
  link: string;
  bookId: string;
}

interface FetchBooksParams {
  skip: number;
  limit: number;
  term: string;
  type: string;
  mediaType: number;
  category: number;
  lang: number;
}

// --- Constantes e Dados Mockados ---
const API_URL = "https://bpocket.vercel.app/api/books";

const mediaTypes = [
  { id: 2, label: "Livros" },
  { id: 3, label: "Audiobooks" },
  { id: 1, label: "Revistas" },
];

const languages = [
  { id: 1, label: "Português" },
  { id: 2, label: "Inglês" },
  { id: 3, label: "Espanhol" },
];

const allCategories = [
  { id: 43, name: "Romance" },
  { id: 1, name: "Ficção Científica" },
  { id: 2, name: "Fantasia" },
  { id: 3, name: "Mistério" },
  { id: 4, name: "Suspense" },
  { id: 5, name: "Terror" },
  { id: 15, name: "Aventura" },
  { id: 22, name: "Biografia" },
  { id: 31, name: "História" },
];

// --- Hooks e Funções Utilitárias ---
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const fetchBooks = async (params: FetchBooksParams): Promise<Book[]> => {
  if (params.term && params.term.length < 4) {
    return [];
  }
  const queryParams = new URLSearchParams({
    itemsSize: String(params.limit),
    skipItems: String(params.skip),
    media: String(params.mediaType),
    category: String(params.category),
    language: String(params.lang),
  });
  if (params.term) {
    queryParams.append(params.type, params.term);
  }
  const requestUrl = `${API_URL}?${queryParams.toString()}`;
  try {
    const response = await axios.get<{ books?: Book[] }>(requestUrl);
    return response.data.books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// --- Componente Principal ---
const BookList: React.FC = () => {
  const defaultFilters = {
    searchType: "title",
    mediaType: 2,
    category: 43,
    language: 1,
  };

  // --- Estados ---
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(defaultFilters.searchType);
  const [selectedMediaType, setSelectedMediaType] = useState(
    defaultFilters.mediaType
  );
  const [selectedCategory, setSelectedCategory] = useState(
    defaultFilters.category
  );
  const [language, setLanguage] = useState(defaultFilters.language);
  const [skipItems, setSkipItems] = useState(0);
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const isInitialLoading = isLoading && skipItems === 0;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const selectedCategoryName = useMemo(
    () => allCategories.find((c) => c.id === selectedCategory)?.name,
    [selectedCategory]
  );

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length < 4) {
      if (debouncedSearchTerm.length === 0) setBooks([]);
      return;
    }
    setIsLoading(true);
    const params: FetchBooksParams = {
      skip: skipItems,
      limit: ITEMS_PER_PAGE,
      term: debouncedSearchTerm,
      type: searchType,
      mediaType: selectedMediaType,
      category: selectedCategory,
      lang: language,
    };
    fetchBooks(params)
      .then((newBooks) => {
        setHasMore(newBooks.length === ITEMS_PER_PAGE);
        setBooks((prevBooks) =>
          skipItems === 0 ? newBooks : [...prevBooks, ...newBooks]
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    debouncedSearchTerm,
    searchType,
    selectedMediaType,
    selectedCategory,
    language,
    skipItems,
  ]);
  // --- Handlers ---
  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
      setter(value);
      setSkipItems(0);
      setBooks([]);
      setHasMore(true);
    };

  const handleRemoveFilter = (filterKey: keyof typeof defaultFilters) => {
    switch (filterKey) {
      case "mediaType":
        handleFilterChange(setSelectedMediaType)(defaultFilters.mediaType);
        break;
      case "category":
        handleFilterChange(setSelectedCategory)(defaultFilters.category);
        break;
      case "language":
        handleFilterChange(setLanguage)(defaultFilters.language);
        break;
      case "searchType":
        handleFilterChange(setSearchType)(defaultFilters.searchType);
        break;
    }
  };

  const loadMore = () => {
    /* ... */
  };

  // NOVO: Lógica para gerar os chips de resumo dos filtros ativos
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedMediaType !== defaultFilters.mediaType) {
      filters.push({
        key: "mediaType",
        label: `Mídia: ${
          mediaTypes.find((m) => m.id === selectedMediaType)?.label
        }`,
      });
    }
    if (selectedCategory !== defaultFilters.category) {
      filters.push({
        key: "category",
        label: `Categoria: ${selectedCategoryName}`,
      });
    }
    if (language !== defaultFilters.language) {
      filters.push({
        key: "language",
        label: `Idioma: ${languages.find((l) => l.id === language)?.label}`,
      });
    }
    return filters;
  }, [selectedMediaType, selectedCategory, language, selectedCategoryName]);

  // Adicione esta função ao seu componente BookList

  const handleClearFilters = () => {
    setSearchTerm("");
    // Usar handleRemoveFilter garante que a busca seja refeita com os valores padrão
    handleRemoveFilter("searchType");
    handleRemoveFilter("mediaType");
    handleRemoveFilter("category");
    handleRemoveFilter("language");
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <AppBar position="sticky">{/* ... */}</AppBar>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // ...
        />

        {/* ======================================================= */}
        {/* PAINEL DE FILTROS RECOLHÍVEL (ACCORDION)                */}
        {/* ======================================================= */}
        <Accordion sx={{ my: 2, "&.Mui-expanded": { margin: "16px 0" } }}>
          {/* --- Cabeçalho do Accordion: Sempre visível, com resumo --- */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ flexGrow: 1, overflow: "hidden" }}
            >
              <Typography sx={{ mr: 1, flexShrink: 0 }}>Filtros</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    label={filter.label}
                    onDelete={() =>
                      handleRemoveFilter(
                        filter.key as keyof typeof defaultFilters
                      )
                    }
                    size="small"
                  />
                ))}
              </Stack>
            </Stack>
          </AccordionSummary>

          {/* --- Detalhes do Accordion: Contém os controles, fica escondido --- */}
          <AccordionDetails>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Buscar por
                </Typography>
                <ToggleButtonGroup
                  value={searchType}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue) handleFilterChange(setSearchType)(newValue);
                  }}
                >
                  <ToggleButton value="title">Título</ToggleButton>
                  <ToggleButton value="authorName">Autor</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Tipo de Mídia
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {mediaTypes.map((media) => (
                    <Chip
                      key={media.id}
                      label={media.label}
                      onClick={() =>
                        handleFilterChange(setSelectedMediaType)(media.id)
                      }
                      variant={
                        selectedMediaType === media.id ? "filled" : "outlined"
                      }
                      color={
                        selectedMediaType === media.id ? "primary" : "default"
                      }
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Categoria
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setCategoryDialogOpen(true)}
                >
                  {selectedCategoryName || "Selecionar Categoria"}
                </Button>
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Idioma
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {languages.map((lang) => (
                    <Chip
                      key={lang.id}
                      label={lang.label}
                      onClick={() => handleFilterChange(setLanguage)(lang.id)}
                      variant={language === lang.id ? "filled" : "outlined"}
                      color={language === lang.id ? "primary" : "default"}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* --- Lógica de Renderização da Lista e "Não Encontrado" (permanece a mesma) --- */}
        {isInitialLoading && (
          <List>
            {Array.from(new Array(ITEMS_PER_PAGE)).map((_, index) => (
              <BookItemSkeleton key={index} />
            ))}
          </List>
        )}

        {!isInitialLoading && books.length > 0 && (
          <InfiniteScroll
            dataLength={books.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            }
            endMessage={
              <Box sx={{ textAlign: "center", p: 3, mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Você chegou ao final dos resultados.
                </Typography>
              </Box>
            }
            style={{ overflow: "visible" }}
          >
            <List>
              {books.map((book) => (
                <BookItem book={book} key={book.bookId} />
              ))}
            </List>
          </InfiniteScroll>
        )}

        {!isLoading && !isInitialLoading && books.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              textAlign: "center",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              minHeight: "60vh",
            }}
          >
            <Lottie
              animationData={animation404}
              loop
              style={{ width: "100%", maxWidth: 100 }}
            />
            <Typography variant="h6">Nenhum livro encontrado</Typography>
            <Typography variant="body1" color="text.secondary">
              Tente ajustar seus filtros ou realizar uma nova busca.
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Limpar Filtros e Recomeçar
            </Button>
          </Paper>
        )}
      </Box>

      {/* --- Dialog de Categorias (permanece o mesmo) --- */}
      <CategorySelectionDialog
        open={isCategoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        selectedValue={selectedCategory}
        onCategoryChange={(newCategoryId) =>
          handleFilterChange(setSelectedCategory)(newCategoryId)
        }
      />
    </div>
  );
};

export default BookList;
