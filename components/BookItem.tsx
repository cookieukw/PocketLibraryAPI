"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card,
    SvgIcon,
    CardContent,
    Grid,
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Box,
    Stack,
    Tooltip
} from "@mui/material";
import {
    FavoriteBorder,
    Favorite,
    Close,
    Link as LinkIcon,
    Info
} from "@mui/icons-material";
import { getIcon, toCamelCase } from "@/classes/util";
import database from "@/classes/database";
import { useReward } from "react-rewards";
import hearthEmojis from "@/classes/hearthEmojis";
import sadEmojis from "@/classes/sadEmojis";

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

interface BookItemProps {
    book: IBook;
    onDelete?: () => void;
    favorite?: boolean;
}

const BookItem: React.FC<BookItemProps> = ({ book, favorite }) => {
    const { title, author, font, size, format, link, bookId } = book;
    const navigate = useRouter().push;
    const [isFavorite, setIsFavorite] = useState(favorite ?? false);
    const [showModal, setShowModal] = useState(false);

    const { reward: hearth, isAnimating: isHeartAnimating } = useReward(
        "sfx",
        "emoji",
        {
            emoji: hearthEmojis
        }
    );
    const { reward: sad, isAnimating: isSadAnimating } = useReward(
        "sfx",
        "emoji",
        {
            emoji: sadEmojis
        }
    );

    const toggleFavorite = async () => {
        if (isFavorite) {
            sad();
            await database.favorites.where("bookId").equals(bookId).delete();
        } else {
            hearth();
            await database.favorites.add(book);
        }
        setIsFavorite(!isFavorite);
    };

    const BookIcon = getIcon(format.substring(1));

    const handleNavigate = () => {
        // Salva os dados no localStorage antes de navegar
        localStorage.setItem(`${bookId}`, JSON.stringify(book));
        navigate(`book-info/${bookId}`);
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    borderRadius: 5,
                    boxShadow: 3,
                    mb: 3,
                    mt: 3,
                    ml: 1,
                    mr: 1
                }}
            >
                <CardContent sx={{ p: "16px !important" }}>
                    <Grid container direction="column" spacing={1}>
                        {/* Título */}
                        <Grid item>
                            <Tooltip title={title}>
                                <Typography
                                    variant="body1"
                                    fontWeight={500}
                                    sx={{
                                        lineHeight: 1.2,
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                        overflow: "hidden"
                                    }}
                                >
                                    {toCamelCase(title)}
                                </Typography>
                            </Tooltip>
                        </Grid>

                        {/* Tamanho e Formato */}
                        <Grid item>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                            >
                                {size} • {format.substring(1).toUpperCase()}
                            </Typography>
                        </Grid>

                        {/* Linha de Ícones */}
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <IconButton size="small" color="primary">
                                        <BookIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        disabled={
                                            isHeartAnimating || isSadAnimating
                                        }
                                        onClick={toggleFavorite}
                                        size="small"
                                        sx={{
                                            color: isFavorite
                                                ? "error.main"
                                                : "text.secondary"
                                        }}
                                    >
                                        <span id="sfx" />
                                        {isFavorite ? (
                                            <Favorite fontSize="small" />
                                        ) : (
                                            <FavoriteBorder fontSize="small" />
                                        )}
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowModal(true)}
                                        sx={{ color: "text.secondary" }}
                                    >
                                        <Info fontSize="small" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Botão Ler */}
                        <Grid item xs={12} sx={{ mt: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={handleNavigate}
                            >
                                Ler
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Modal de Detalhes */}
            <Dialog
                open={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ py: 2, px: 3 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        Detalhes do Livro
                        <IconButton
                            onClick={() => setShowModal(false)}
                            size="small"
                            sx={{ color: "text.secondary" }}
                        >
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers sx={{ py: 2, px: 3 }}>
                    <Stack spacing={2}>
                        <SvgIcon
                            component={getIcon(format.substring(1))}
                            fontSize="large"
                            color="primary"
                            sx={{ height: 60, width: 60, margin: "auto" }}
                        />

                        <Typography variant="h6">
                            {toCamelCase(title)}
                        </Typography>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                {toCamelCase(author)}
                            </Typography>
                        </Box>

                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Formato"
                                    secondary={format
                                        .substring(1)
                                        .toUpperCase()}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Tamanho"
                                    secondary={size}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Fonte"
                                    secondary={font}
                                />
                            </ListItem>
                        </List>

                        <Button
                            fullWidth
                            variant="contained"
                            href={link}
                            target="_blank"
                            startIcon={<LinkIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Acessar Conteúdo
                        </Button>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ py: 2, px: 3 }}>
                    <Button
                        onClick={() => setShowModal(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default BookItem;
