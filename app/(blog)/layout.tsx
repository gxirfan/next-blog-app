import { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import {
  getSeoAuthors,
  getSeoCreator,
  getSeoDescription,
  getSeoKeywords,
  getSeoOpenGraphDescription,
} from "../constants/seo";

export const metadata: Metadata = {
  title: {
    default: "Home",
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

export default function blogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-layout min-h-screen pt-16 w-full flex flex-col">
      <Navbar />

      <main className="main-content pt-6 w-full md:w-3/4 lg:w-2/3 xl:w-2/4 2xl:w-2/4 3xl:w-2/5 p-6 grow">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
