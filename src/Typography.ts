import { css } from "lit";

export const typography = css`
  :host {
    /* font family */
    --font-family-sans: "Noto Sans JP", system-ui, -apple-system,
      BlinkMacSystemFont, sans-serif;
    --font-family-serif: "Noto Serif JP", Georgia, serif;
    --font-family-monospace: "Fira Code", Menlo, monospace;

    /* font weight */
    --font-regular: 400;
    --font-medium: 500;
    --font-bold: 700;
    --font-extrabold: 800;

    /* font size */
    --font-xs: 0.75rem; /* 12px */
    --font-sm: 0.875rem; /* 14px */
    --font-base: 1rem; /* 16px (basic size) */
    --font-lg: 1.125rem; /* 18px */
    --font-xl: 1.25rem; /* 20px */
    --font-2xl: 1.5rem; /* 24px */
    --font-3xl: 1.875rem; /* 30px */
    --font-4xl: 2.25rem; /* 36px */
    --font-5xl: 3rem; /* 48px */

    /* line height */
    --lh-base: 1.5; /* text */
    --lh-heading: 1.3; /* heading */
    --lh-tight: 1.2;

    /* letter spacing */
    --tracking-normal: normal;
    --tracking-wide: 0.02em;
    --tracking-wider: 0.05em;

    /* spacing */
    --spacing-1: 4px;
    --spacing-2: 8px;
    --spacing-3: 12px;
    --spacing-4: 16px;
    --spacing-5: 20px;
    --spacing-6: 24px;
    --spacing-8: 32px;
    --spacing-10: 40px;
    --spacing-12: 48px;
    --spacing-16: 64px;
    --spacing-20: 80px;
    --spacing-24: 96px;

    /* reset css */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
      font-family: var(--font-family-sans);
      font-weight: var(--font-bold);
      line-height: var(--lh-heading);
    }

    h1 {
      font-size: var(--font-4xl); /* 36px */
    }
    h2 {
      font-size: var(--font-3xl); /* 30px */
    }
    h3 {
      font-size: var(--font-2xl); /* 24px */
    }
    h4 {
      font-size: var(--font-xl); /* 20px */
    }
    h5 {
      font-size: var(--font-lg); /* 18px */
    }
    h6 {
      font-size: var(--font-base); /* 16px */
      font-weight: var(--font-medium);
    }

    p,
    span,
    li,
    dd,
    dt {
      font-family: var(--font-family-sans);
      line-height: var(--lh-base);
      letter-spacing: var(--tracking-normal);
      margin: 0;
    }

    p + p {
      margin-top: var(--spacing-3);
    }
  }
`;
