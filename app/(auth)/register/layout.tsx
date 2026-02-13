import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to blog App.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
