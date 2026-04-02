import { useEffect, useState } from "react";
import { ThemeProviderContext, type Theme } from "@/app/context/ThemeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const THEME_DB_NAME = "FinanceDashboardPreferences";
const THEME_STORE_NAME = "preferences";
const THEME_DB_VERSION = 1;

const openThemeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(THEME_DB_NAME, THEME_DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(THEME_STORE_NAME)) {
        db.createObjectStore(THEME_STORE_NAME, { keyPath: "key" });
      }
    };
  });
};

const getStoredTheme = async (storageKey: string): Promise<Theme | null> => {
  const db = await openThemeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(THEME_STORE_NAME, "readonly");
    const store = transaction.objectStore(THEME_STORE_NAME);
    const request = store.get(storageKey);

    request.onerror = () => reject(request.error);
    request.onsuccess = () =>
      resolve((request.result?.value as Theme | undefined) ?? null);
  });
};

const setStoredTheme = async (
  storageKey: string,
  theme: Theme,
): Promise<void> => {
  const db = await openThemeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(THEME_STORE_NAME, "readwrite");
    const store = transaction.objectStore(THEME_STORE_NAME);
    const request = store.put({ key: storageKey, value: theme });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getStoredTheme(storageKey);
        if (savedTheme) setTheme(savedTheme);
      } catch (error) {
        console.error("Failed to read theme", error);
      }
    };

    void loadTheme();
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      void setStoredTheme(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
