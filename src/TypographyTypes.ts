export interface TypographyRules {
	baseFontSize: number;
	baseLineHeight: number;
	headings: {
		[tagName: string]: {
			fontSize: number;
			lineHeight: number;
		};
	};
	allowedFonts: string[];
}
