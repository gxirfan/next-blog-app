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
import { ENV } from "@/config/env.config";

export const metadata: Metadata = {
  title: {
    default: "Home",
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
