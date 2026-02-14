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
    default: process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog App",
    template: `%s | ${process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog App"}`,
  },
  description: getSeoDescription(),
  authors: getSeoAuthors().map((name) => ({ name })),
  creator: getSeoCreator(),
  keywords: getSeoKeywords(),

  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    description: getSeoOpenGraphDescription(),
    siteName: process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog App",
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
        <CookieConsentModal
          blogName={process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog App"}
        />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
