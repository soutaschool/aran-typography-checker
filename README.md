# Karan Typography Checker

**Typography Checker** is a web component built with **Lit** and **TypeScript** that scans your HTML content for various typography issues based on a configurable design system. It displays detected issues in a side panel and offers **automatic fixes** where applicable.

## Features

1. **Font Size Check**

   - Detects elements with font sizes below the minimum specified in your design system.
   - **Auto Fix**: Adjusts the `font-size` to the recommended value.

2. **Line-height Check**

   - Detects elements with line-heights below the recommended ratio.
   - **Auto Fix**: Adjusts the `line-height` to the recommended value.

3. **Font Family Check**

   - Identifies elements using fonts not included in the `allowedFonts` list.
   - **Auto Fix**: Changes the `font-family` to the first allowed font.

4. **Heading Hierarchy**

   - Detects jumps in heading levels (e.g., jumping from `H2` to `H5`).
   - **Auto Fix**: Replaces the heading tag to maintain proper hierarchy (e.g., `H5` → `H3`).

5. **Emphasis Style**

   - Detects overly bold `<strong>` elements (`font-weight: 900` or higher).
   - **Auto Fix**: Resets the `font-weight` to a more appropriate level (e.g., `700`).

6. **Link Style**
   - Detects links that are not visually distinguishable (e.g., no underline, same color as background).
   - **Auto Fix**: Adds an underline and changes the link color for better visibility.

## Installation & Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server (if using Vite or similar)**

```bash
npm run dev
```

3. **Build for Production**

```bash
npm run build
```

## How It Works

### Slot-based Content Scanning

- The `<typography-checker>` component scans all child elements within its slot.
- It recursively checks each element for typography issues based on the configured design system.

### Issue Detection & Display

- Detected issues are listed in the side panel with details and suggestions.
- Some issues offer an **Auto Fix** option to automatically correct the problem.

### Customization

- Modify `TypographyConfig.ts` to adjust the design system settings such as base font size, line-height, allowed fonts, and heading sizes.

## Fixing Issues

### Font Size & Line-height

- Click **Auto Fix** to update the styles to the recommended values.

### Heading Hierarchy

- Click **Auto Fix** to change the heading level to maintain proper hierarchy.

## Future Improvements

### Source Mapping

- Display file names and line numbers for each issue (requires build-time tooling).

### Localization

- Support multiple languages for error messages and suggestions.

### CI/CD Integration

- Incorporate typography checks into your CI/CD pipeline to catch issues early.

### Design Tool Plugins

- Create plugins for design tools like Figma or Sketch to enforce typography rules during the design phase.
