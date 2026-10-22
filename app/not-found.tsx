import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found – Jordan Hughes" };

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p className="intro">
        There’s nothing at this address. <Link href="/">Go to the home page</Link>.
      </p>
    </main>
  );
}
