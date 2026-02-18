// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import {
  Inter,
  Space_Mono,
  Urbanist,
  JetBrains_Mono,
  Space_Grotesk,
  Poppins,
} from "next/font/google";
import { CookieConsentModal } from "./components/CookieConsentModal";
import NextTopLoader from "nextjs-toploader";
import ScrollToTopButton from "./components/ScrollToTopButton";
import StatusGuard from "./components/StatusGuard"; // Yeni ekledik
import {
  getSeoDescription,
  getSeoCreator,
  getSeoAuthors,
  getSeoKeywords,
  getSeoOpenGraphDescription,
} from "./constants/seo";
import { ENV } from "@/config/env.config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});
const urbanistFont = Urbanist({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-urbanist",
});
const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
const spaceGrotesk = Space_Grotesk({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: ENV.PROJECT_NAME,
    template: `%s | ${ENV.PROJECT_NAME}`,
  },
  description: getSeoDescription(),
  authors: getSeoAuthors().map((name) => ({ name })),
  creator: getSeoCreator(),
  keywords: getSeoKeywords(),

  openGraph: {
    type: "website",
    locale: "en_US",
    url: ENV.SITE_URL,
    description: getSeoOpenGraphDescription(),
    siteName: ENV.PROJECT_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} ${urbanistFont.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable} ${poppins.variable} bg-neutral-950 text-white`}
      suppressHydrationWarning
    >
      <body className="text-white antialiased">
        <NextTopLoader color="#00bcd4" showSpinner={false} />
        <AuthProvider>
          <StatusGuard>{children}</StatusGuard>
        </AuthProvider>
        <CookieConsentModal blogName={ENV.PROJECT_NAME} />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
