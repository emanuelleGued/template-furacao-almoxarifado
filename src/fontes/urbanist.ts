import localFont from "next/font/local";

// Urbanist e a familia unica da identidade IDE.IA: o peso e o que separa um
// titulo do corpo do texto. Os arquivos sao servidos pela propria aplicacao,
// porque tech-stack.md proibe servico externo — nada de Google Fonts.
// Licenca SIL Open Font License em ./OFL.txt.
export const urbanist = localFont({
  src: [
    { path: "./Urbanist-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Urbanist-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Urbanist-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Urbanist-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Urbanist-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
