import Link from "next/link";
import { ArrowLeft, Frown } from "lucide-react";

export default function NotFound() {
  const ACCENT_COLOR = "text-cyan-400";

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-neutral-950">
      <Frown size={80} className={`${ACCENT_COLOR} mb-6`} />

      <h1 className="text-6xl font-extrabold text-white mb-4">404 Not Found</h1>

      <p className="text-xl text-neutral-400 mb-8 text-center">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className={`px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-lg font-semibold transition-colors flex items-center justify-center`}
      >
        <ArrowLeft size={16} className="mr-2" />
        Return Home
      </Link>
    </div>
  );
}
