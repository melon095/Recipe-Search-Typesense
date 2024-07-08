"use client";

import { useTheme } from "@/contexts/theme-context";

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<>
			<button onClick={toggleTheme}>
				{theme === "light" ? "🌞" : "🌜"}
			</button>
		</>
	);
}
