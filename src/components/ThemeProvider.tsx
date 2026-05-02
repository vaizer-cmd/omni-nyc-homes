import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useThemedPath } from "@/hooks/use-themed-path";
import { palettes, DEFAULT_PALETTE_ID, Palette } from "@/lib/staging-palettes";

type StagingThemeContextValue = {
  palette: Palette;
  paletteId: string;
  setPaletteId: (id: string) => void;
  palettes: Palette[];
  isStaging: boolean;
};

const StagingThemeContext = createContext<StagingThemeContextValue | null>(null);

const STORAGE_KEY = "staging-palette-id";

const allKnownVarNames = Array.from(
  new Set(palettes.flatMap((p) => Object.keys(p.vars))),
);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isStaging } = useThemedPath();

  const [paletteId, setPaletteIdState] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_PALETTE_ID;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && palettes.some((p) => p.id === stored)) return stored;
    return DEFAULT_PALETTE_ID;
  });

  const palette =
    palettes.find((p) => p.id === paletteId) ?? palettes[0];

  const setPaletteId = (id: string) => {
    setPaletteIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isStaging) root.classList.add("staging");
    else root.classList.remove("staging");
  }, [isStaging]);

  useEffect(() => {
    const root = document.documentElement;
    allKnownVarNames.forEach((name) => root.style.removeProperty(name));
    if (isStaging) {
      Object.entries(palette.vars).forEach(([name, value]) => {
        root.style.setProperty(name, value);
      });
    }
  }, [isStaging, palette]);

  return (
    <StagingThemeContext.Provider
      value={{ palette, paletteId, setPaletteId, palettes, isStaging }}
    >
      {children}
    </StagingThemeContext.Provider>
  );
};

export const useStagingTheme = () => {
  const ctx = useContext(StagingThemeContext);
  if (!ctx) throw new Error("useStagingTheme must be used inside ThemeProvider");
  return ctx;
};

export default ThemeProvider;
