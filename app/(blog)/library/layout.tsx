import { Metadata } from "next";
import AuthGuardForLibrary from "./AuthGuardForLibrary";

export const metadata: Metadata = {
  title: "Library",
  description: "User library page.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuardForLibrary>{children}</AuthGuardForLibrary>;
}
