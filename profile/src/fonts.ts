import { readFileSync, readdirSync } from 'node:fs';

const fontBase64FromDir = (relativeDir: string, extension: string) => {
  const dirUrl = new URL(relativeDir, import.meta.url);
  const file = readdirSync(dirUrl).find((name) =>
    name.toLowerCase().endsWith(extension.toLowerCase())
  );

  if (!file) {
    throw new Error(
      `No ${extension} font found in ${relativeDir}. Check your fonts directory setup.`
    );
  }

  return readFileSync(new URL(`${relativeDir}/${file}`, import.meta.url)).toString('base64');
};

// Subsetted woff2 files, embedded as base64 so they render inside the <img>-loaded SVG
const MONO_WOFF2 = fontBase64FromDir('../fonts/mono', '.woff2');
const SERIF_WOFF2 = fontBase64FromDir('../fonts/serif', '.woff2');

export const fontFaces = /* css */ `
  @font-face {
    font-family: 'Mono';
    src: url(data:font/woff2;base64,${MONO_WOFF2}) format('woff2');
    font-display: swap;
  }
  @font-face {
    font-family: 'Serif';
    src: url(data:font/woff2;base64,${SERIF_WOFF2}) format('woff2');
    font-display: swap;
  }
`;
