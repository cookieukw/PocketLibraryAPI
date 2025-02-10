import { Typography, Box } from "@mui/material";

const DetailItem = ({
    icon,
    label,
    value
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
}) => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box sx={{ color: "text.secondary" }}>{icon}</Box>
        <Box>
            <Typography
                variant="caption"
                sx={{ color: "text.secondary", lineHeight: 1 }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "text.primary" }}
            >
                {value || "Indisponível"}
            </Typography>
        </Box>
    </Box>
);
export default DetailItem;
