"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Box,
  Button,
  CardContent,
  Card,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Download,
  Category,
  Language,
  School,
  BarChart,
  Visibility,
  CalendarToday,
  Description,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { getIcon, toCamelCase } from "@/classes/utils";
import animation404 from "@/lottie/404.json";
import DetailItem from "@/components/DetailItem";

import dynamic from "next/dynamic";
import database from "@/classes/database";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { useParams } from "next/navigation";
import { handleDownloadFile } from "@/lib/download-file";

interface IBook {
  bookId: string;
  downloadUrl: string;
  title: string;
  author: string;
  category: string;
  language: string;
  institutionOrPartner: string;
  institutionOrProgram: string;
  knowledgeArea: string;
  level: string;
  thesisYear: string;
  accesses: number;
  abstract: string;
  format: string;
  font: string;
  size: string;
  sizeByBytes: string;
  link: string;
}

const getCachedBookContent = (bookId: string): IBook | null => {
  try {
    const cachedData = localStorage.getItem(bookId);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Error parsing cached book data:", error);
    return null;
  }
};

const BookInfo = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [bookInfo, setBookInfo] = useState<IBook>({
    bookId: "",
    downloadUrl: "",
    title: "",
    author: "",
    category: "",
    language: "",
    institutionOrPartner: "",
    institutionOrProgram: "",
    knowledgeArea: "",
    level: "",
    thesisYear: "",
    accesses: 0,
    abstract: "",
    font: "",
    size: "",
    sizeByBytes: "",
    link: "",
    format: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const BookIcon = getIcon(bookInfo.format?.substring(1) ?? "pdf");

  const fetchBookInfo = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const [apiResponse] = await Promise.all([
          axios.get<IBook>(`/api/ebook/${bookId}`, { signal }),
          database.favorites.get(bookId).then((book) => setIsFavorite(!!book)),
        ]);

        const mergedData: IBook = {
          ...getCachedBookContent(bookId),
          ...apiResponse.data,
        };

        setBookInfo(mergedData);

        try {
          localStorage.setItem(bookId, JSON.stringify(mergedData));
        } catch (storageError) {
          console.error("LocalStorage error:", storageError);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching book info:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [bookId]
  );

  const toggleFavorite = useCallback(async () => {
    try {
      if (isFavorite) {
        await database.favorites.delete(bookId);
      } else {
        await database.favorites.put(bookInfo);
      }
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  }, [bookId, isFavorite, bookInfo]);

  useEffect(() => {
    const abortController = new AbortController();

    if (bookId) {
      const cachedData = getCachedBookContent(bookId);
      if (cachedData) {
        setBookInfo(cachedData);
        setIsLoading(false);
      }
      fetchBookInfo(abortController.signal);
    }

    return () => abortController.abort();
  }, [bookId, fetchBookInfo]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper" }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Detalhes do Livro
          </Typography>
          <IconButton
            color={isFavorite ? "error" : "inherit"}
            onClick={toggleFavorite}
            size="large"
            aria-label="Favorito"
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ p: 4, pb: 5 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              height: "50vh",
              alignItems: "center",
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : bookInfo ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                    textAlign: "center",
                  }}
                >
                  <BookIcon />

                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {bookInfo.title}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{ color: "text.secondary" }}
                  >
                    por {toCamelCase(bookInfo.author)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    mb: 4,
                  }}
                >
                  {/* Coluna Esquerda */}
                  <Box sx={{ display: "grid", gap: 2 }}>
                    <DetailItem
                      icon={<Category fontSize="small" />}
                      label="Categoria"
                      value={bookInfo.category}
                    />
                    <DetailItem
                      icon={<Language fontSize="small" />}
                      label="Idioma"
                      value={bookInfo.language}
                    />
                    <DetailItem
                      icon={<School fontSize="small" />}
                      label="Instituição/Parceiro"
                      value={bookInfo.institutionOrPartner}
                    />
                  </Box>

                  {/* Coluna Direita */}
                  <Box sx={{ display: "grid", gap: 2 }}>
                    <DetailItem
                      icon={<BarChart fontSize="small" />}
                      label="Área de Conhecimento"
                      value={bookInfo.knowledgeArea}
                    />
                    <DetailItem
                      icon={<CalendarToday fontSize="small" />}
                      label="Ano da Tese"
                      value={bookInfo.thesisYear}
                    />
                    <DetailItem
                      icon={<Visibility fontSize="small" />}
                      label="Acessos"
                      value={bookInfo.accesses}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const proxiedUrl = `/api/proxy?url=${encodeURIComponent(
                        bookInfo.downloadUrl
                      )}&name=${encodeURIComponent(bookInfo.title)}&extension=${
                        bookInfo.format
                      }`;
                      handleDownloadFile(
                        proxiedUrl,
                        bookInfo.title,
                        bookInfo.format
                      );
                    }}
                    startIcon={<Download />}
                    size="large"
                  >
                    Baixar Arquivo
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Seção de Resumo */}
            <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "text.primary",
                  }}
                >
                  <Description sx={{ fontSize: 28 }} />
                  Resumo
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    color: "text.secondary",
                    whiteSpace: "pre-line",
                  }}
                >
                  {bookInfo.abstract || "Resumo não disponível"}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              height: "70vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Lottie
                animationData={animation404}
                style={{
                  width: "100%",
                  maxWidth: 400,
                  margin: "0 auto",
                }}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                Ops! Livro não encontrado
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 3, borderRadius: 2 }}
                onClick={() => router.back()}
                startIcon={<ArrowBack />}
              >
                Voltar para a busca
              </Button>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default BookInfo;
