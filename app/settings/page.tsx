"use client";
import { FormControlLabel, Switch, Box, Container, Typography } from "@mui/material";
import { useThemeStore } from "@/stores/themeStore";

const Config = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <Container maxWidth="sm" sx={{ pt: 4 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          boxShadow: 1
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="primary"
            />
          }
          label={
            <Typography variant="body1" component="span">
              Modo Escuro
            </Typography>
          }
          labelPlacement="start"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            m: 0
          }}
        />
      </Box>
    </Container>
  );
};

export default Config;