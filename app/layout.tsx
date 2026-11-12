import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Inter,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Sans_Arabic,
} from "next/font/google";
import { AmanGeneProvider } from "@/context/AmanGeneContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AmanGene AI | Clinical Genomic Care · Abu Dhabi",
  description:
    "Bilingual UAE sovereign premarital genomic carrier education, reciprocal partner comparison, and genetic counselor review workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AmanGeneProvider>{children}</AmanGeneProvider>
      </body>
    </html>
  );
}
