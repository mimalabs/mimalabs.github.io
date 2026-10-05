import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section-shell flex min-h-[70vh] items-center justify-center py-16 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-brand-brown">This little world is not here yet.</h1>
        <Link href="/en/" className="mt-8 inline-flex rounded-full bg-brand-brown px-6 py-3 font-extrabold text-white">Back to MIMA LABS</Link>
      </div>
    </main>
  );
}
