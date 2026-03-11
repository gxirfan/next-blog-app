import ContactForm from "./_components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with us for any inquiries.",
};

export default function Page() {
  return <ContactForm />;
}
