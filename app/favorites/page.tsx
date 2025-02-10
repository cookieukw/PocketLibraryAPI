"use client";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animation404 from "@/lottie/404.json";
import { ArrowBack } from "@mui/icons-material";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Box,
    CircularProgress
} from "@mui/material";
import { useRouter } from "next/navigation";
import BookItem from "@/components/BookItem";
import db from "@/classes/database";

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

const Favorite: React.FC = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const fetchFavorites = useCallback(async () => {
        try {
            const favBooks = await db.favorites.toArray();
            setBooks(favBooks);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
            }}
        >
            <AppBar position="sticky" >
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
                        Favoritos
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 3, flex: 1 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : books.length > 0 ? (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(300px, 1fr))"
                        }}
                    >
                        {books.map((book: IBook) => (
                            <BookItem
                                key={book.bookId}
                                book={book}
                                favorite={true}
                                onDelete={() => {
                                    setBooks(prev =>
                                        prev.filter(
                                            b => b.bookId !== book.bookId
                                        )
                                    );
                                }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "70vh"
                        }}
                    >
                        <Lottie
                            animationData={animation404}
                            loop
                            style={{ width: "100%", maxWidth: 400 }}
                        />
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            Nenhum favorito encontrado
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Favorite;
