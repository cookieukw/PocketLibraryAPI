"use client";

import { useState, useEffect, useCallback } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    List,
    CircularProgress,
    Box,
    Button,
    LinearProgress
} from "@mui/material";
import { Search, ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import InfiniteScroll from "react-infinite-scroll-component";
import MediaSelectionMenu from "@/components/MediaSelectionMenu";
import CategorySelectionMenu from "@/components/CategorySelectionMenu";
import BookItem from "@/components/BookItem";
import LanguageSelection from "@/components/LanguageSelection";
import animation404 from "@/lottie/404.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface IBook {
    title: string;
    author: string;
    font: string;
    size: string;
    sizeByBytes: string;
    format: string;
    link: string;
    bookId: string;
}

const url: string = "https://bpocket.vercel.app/api/books";

const BookList: React.FC = () => {
    const [skipItems, setSkipItems] = useState<number>(0);
    const [itemsSize] = useState<number>(10);
    const [books, setBooks] = useState<IBook[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("title");
    const [selectedMediaType, setSelectedMediaType] = useState<number>(2);
    const [selectedCategory, setSelectedCategory] = useState<number>(43);
    const [language, setLanguage] = useState<number>(1);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getBooks = useCallback(
        async (
            skip: number,
            term: string,
            type: string,
            mediaType: number,
            category: number,
            lang: number
        ) => {
            setIsLoading(true);
            try {
                const requestUrl: string = `${url}?itemsSize=${itemsSize}&skipItems=${skip}&${type}=${term}&media=${mediaType}&category=${category}&language=${lang}`;
                const response = await axios.get(requestUrl);
                const newBooks: IBook[] = response.data;

                setBooks(prevBooks => {
                    if (skip === 0) return newBooks;
                    const filteredBooks = newBooks.filter(
                        newBook =>
                            !prevBooks.some(
                                book => book.bookId === newBook.bookId
                            )
                    );
                    //  setHasMore(filteredBooks.length > 0);
                    return [...prevBooks, ...filteredBooks];
                });
            } catch (error) {
                console.error("Error fetching books:", error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        },
        [itemsSize]
    );

    const handleSearchDebounced = debounce((value: string) => {
        if (value.length < 4 && value.length > 0) return;
        setSkipItems(0);
        setHasMore(true);
        getBooks(
            0,
            value,
            searchType,
            selectedMediaType,
            selectedCategory,
            language
        );
    }, 500);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextSkip = skipItems + itemsSize;
            setSkipItems(nextSkip);
            getBooks(
                nextSkip,
                searchTerm,
                searchType,
                selectedMediaType,
                selectedCategory,
                language
            );
        }
    };

    useEffect(() => {
        getBooks(
            skipItems,
            searchTerm,
            searchType,
            selectedMediaType,
            selectedCategory,
            language
        );
    }, [
        skipItems,
        searchType,
        selectedMediaType,
        selectedCategory,
        language,
        getBooks,
        searchTerm
    ]);

    return (
        <div style={{ minHeight: "100vh" }}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        PocketLibrary
                    </Typography>
                    {isLoading && (
                        <LinearProgress
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0
                            }}
                        />
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    color="primary"
                    variant="outlined"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        handleSearchDebounced(e.target.value);
                    }}
                    error={searchTerm.length > 0 && searchTerm.length < 4}
                    helperText={
                        searchTerm.length > 0 && searchTerm.length < 4
                            ? "Digite no mínimo 4 caracteres"
                            : ""
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                />

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button
                        onClick={() => setShowCategories(prev => !prev)}
                        variant="text"
                        endIcon={
                            showCategories ? <ExpandLess /> : <ExpandMore />
                        }
                        sx={{ margin: 2 }}
                    >
                        {showCategories
                            ? "Esconder Filtros"
                            : "Mostrar Filtros"}
                    </Button>
                </motion.div>

                <AnimatePresence>
                    {showCategories && (
                        <Card sx={{ padding: 2, margin: 3 }}>
                            <FormControl fullWidth sx={{ minWidth: 200, m: 1 }}>
                                <InputLabel>Tipo de Busca</InputLabel>
                                <Select
                                    value={searchType}
                                    label="Tipo de Busca"
                                    onChange={e => {
                                        setSearchType(e.target.value as string);
                                        setSkipItems(0);
                                        getBooks(
                                            0,
                                            searchTerm,
                                            e.target.value as string,
                                            selectedMediaType,
                                            selectedCategory,
                                            language
                                        );
                                    }}
                                >
                                    <MenuItem value="title">Título</MenuItem>
                                    <MenuItem value="authorName">
                                        Autor
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <MediaSelectionMenu
                                selectedMediaType={selectedMediaType}
                                setSelectedMediaType={setSelectedMediaType}
                                onMediaTypeChange={value => {
                                    setSkipItems(0);
                                    getBooks(
                                        0,
                                        searchTerm,
                                        searchType,
                                        value,
                                        selectedCategory,
                                        language
                                    );
                                }}
                            />

                            <CategorySelectionMenu
                                setSelectedCategory={setSelectedCategory}
                                selectedCategory={selectedCategory}
                                selectedMediaType={selectedMediaType}
                                onCategoryChange={value => {
                                    setSelectedCategory(value);
                                    setSkipItems(0);
                                    getBooks(
                                        0,
                                        searchTerm,
                                        searchType,
                                        selectedMediaType,
                                        value,
                                        language
                                    );
                                }}
                            />

                            <LanguageSelection
                                onLanguageChange={lang => {
                                    setLanguage(lang);
                                    setSkipItems(0);
                                    getBooks(
                                        0,
                                        searchTerm,
                                        searchType,
                                        selectedMediaType,
                                        selectedCategory,
                                        lang
                                    );
                                }}
                                language={language}
                                setLanguage={setLanguage}
                            />
                        </Card>
                    )}
                </AnimatePresence>

                <div
                    id="scrollableDiv"
                    style={{
                        height: "calc(100vh - 300px)",
                        overflow: "auto",
                        position: "relative"
                    }}
                >
                    <InfiniteScroll
                        dataLength={books.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 3
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        }
                        scrollableTarget="scrollableDiv"
                        scrollThreshold={0.95}
                        endMessage={
                            <Box sx={{ textAlign: "center", p: 3 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Você chegou ao final dos resultados
                                </Typography>
                            </Box>
                        }
                    >
                        <List>
                            {books.map((book: IBook) => (
                                <BookItem book={book} key={book.bookId} />
                            ))}
                        </List>
                    </InfiniteScroll>

                    {books.length === 0 && !isLoading && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4
                            }}
                        >
                            <Lottie
                                animationData={animation404}
                                loop
                                style={{ width: "100%", maxWidth: 400 }}
                            />
                        </Box>
                    )}
                </div>
            </Box>
        </div>
    );
};

export default BookList;
