import type { TypographyRules } from "./TypographyTypes.js";

export const designSystemConfig: TypographyRules = {
	baseFontSize: 16,
	baseLineHeight: 1.5,
	headings: {
		h1: { fontSize: 32, lineHeight: 1.3 },
		h2: { fontSize: 24, lineHeight: 1.4 },
		h3: { fontSize: 20, lineHeight: 1.4 },
	},
	allowedFonts: ["Arial", "Helvetica", "Noto Sans", "sans-serif"],
};
