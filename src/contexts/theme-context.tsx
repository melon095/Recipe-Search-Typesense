"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeContextValue = "light" | "dark";
interface ThemeContextProps {
	theme: ThemeContextValue;
	toggleTheme: () => void;
}

const defaultTheme: ThemeContextValue = "light";
const themeKey = "theme";

const isValidTheme = (theme: string): theme is ThemeContextValue =>
	theme === "light" || theme === "dark";

export const ThemeContext = createContext<ThemeContextProps | undefined>(
	undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<ThemeContextValue>(defaultTheme);

	// Initialize the theme from local storage
	useEffect(() => {
		const savedTheme = localStorage.getItem(themeKey);
		if (savedTheme !== null && isValidTheme(savedTheme)) {
			setTheme(savedTheme);
		} else {
			const cssTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			setTheme(cssTheme);
		}
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");

		localStorage.setItem(themeKey, theme);
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextProps {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("'useTheme' must be used within a 'ThemeProvider'");
	}

	return context;
}
