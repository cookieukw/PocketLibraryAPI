"use client";
import { teal } from "@mui/material/colors";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Home, Favorite, Settings } from "@mui/icons-material";
import { useMemo } from "react";
import { useThemeStore } from "@/stores/themeStore";
export default function NavigationTabs({
    children
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const darkMode = useThemeStore(state => state.darkMode);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: darkMode ? "dark" : "light",
                primary: {
                    main: teal[800],
                    light: teal[800]
                }
            },
            components: {
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            "& .MuiInputBase-root": {
                                borderRadius: 50,
                                
                            }
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: "none",
                            py: 0.5,
                            borderRadius: 50
                        }
                    }
                },
                MuiSelect: {
                    styleOverrides: {
                        root: {
                            borderRadius: 50
                        }
                    }
                }
            }
        });
    }, [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="flex flex-col h-screen">
                <main className="flex-1 overflow-y-auto">{children}</main>
                <BottomNavigation
                    showLabels
                    value={pathname}
                    onChange={(_, newValue) => router.push(newValue)}
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        width: "100%",
                        borderTop: "1px solid",
                        borderColor: "divider"
                    }}
                >
                    <BottomNavigationAction
                        label="Início"
                        value="/"
                        icon={<Home />}
                    />
                    <BottomNavigationAction
                        label="Favoritos"
                        value="/favorites"
                        icon={<Favorite />}
                    />
                    <BottomNavigationAction
                        label="Configurações"
                        value="/settings"
                        icon={<Settings />}
                    />
                </BottomNavigation>
            </div>
        </ThemeProvider>
    );
}
