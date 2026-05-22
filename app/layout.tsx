// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DREMARS Vault - Arquitectura del Futuro",
  description: "Banco inteligente de referencias + AI Concept Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white dark:bg-zinc-950`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}