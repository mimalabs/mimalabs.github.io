import Link from "next/link";
import { withBasePath } from "@/config/site";

export default function RootPage() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center py-16 text-center">
      <meta httpEquiv="refresh" content={`0;url=${withBasePath("/en/")}`} />
      <div>
        <p className="eyebrow">MIMA LABS</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-brand-brown">Awakening your creativity</h1>
        <p className="mt-4 text-brand-muted">Redirecting to the English site…</p>
        <Link href="/en/" className="mt-7 inline-flex rounded-full bg-brand-brown px-6 py-3 font-extrabold text-white">Continue</Link>
      </div>
    </main>
  );
}
