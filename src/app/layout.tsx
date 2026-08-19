import type { Metadata } from "next";
import { urbanist } from "@/fontes/urbanist";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almoxarifado",
  description: "Controle de materiais do laboratório IDE.IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${urbanist.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
