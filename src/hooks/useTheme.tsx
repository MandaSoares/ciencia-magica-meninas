import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  /** true só dentro da conta; telas públicas (landing, login, cadastro) são sempre claras */
  setThemeEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setThemeEnabled: () => {},
});

const readSavedTheme = (): Theme => {
  try {
    return localStorage.getItem("conscientistas-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  const [enabled, setThemeEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", enabled && theme === "dark");
  }, [theme, enabled]);

  // Ao sair do app (desmontar), garante o tema claro nas páginas públicas
  useEffect(() => () => document.documentElement.classList.remove("dark"), []);

  useEffect(() => {
    try {
      localStorage.setItem("conscientistas-theme", theme);
    } catch {
      /* navegação privada sem storage: ignora */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
