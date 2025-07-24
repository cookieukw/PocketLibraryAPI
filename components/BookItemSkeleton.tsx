
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,

} from "@mui/material";
import { motion } from "framer-motion";

const BookItemSkeleton: React.FC = () => {
  return (
    // Animação sutil de fade-in para uma entrada mais suave
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ListItem sx={{ my: 1 }}>
        <ListItemIcon sx={{ mr: 2 }}>
          {/* Skeleton para a capa do livro */}
          <Skeleton variant="rectangular" width={60} height={85} />
        </ListItemIcon>
        <ListItemText
          primary={
            // Skeleton para o título
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="80%" />
          }
          secondary={
            <>
              {/* Skeleton para o autor */}
              <Skeleton variant="text" width="50%" />
              {/* Skeleton para informações adicionais (tamanho, formato) */}
              <Skeleton variant="text" width="60%" />
            </>
          }
        />
      </ListItem>
    </motion.div>
  );
};

export default BookItemSkeleton;