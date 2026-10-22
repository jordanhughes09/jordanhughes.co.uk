import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { themeColors, themeScript } from "./theme";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-schibsted",
  display: "swap",
});

const title = "Jordan Hughes – Senior Product Manager for AI at Sky";
const description =
  "Jordan Hughes is a Senior Product Manager for AI at Sky in London. He turns business problems into working AI products and builds a lot of them himself.";

// Icons come from icon.svg and apple-icon.png in this folder. The share image is public/og.png,
// declared here because this Next.js version drops opengraph-image.alt.txt.
const image = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Jordan Hughes, Senior Product Manager for AI at Sky",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jordanhughes.co.uk"),
  title,
  description,
  authors: [{ name: "Jordan Hughes" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Jordan Hughes",
    locale: "en_GB",
    title,
    description,
    images: [image],
  },
  twitter: { card: "summary_large_image", title, description, images: [image] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // themeScript may set data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en-GB" className={schibsted.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{".theme-toggle { display: none; }"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
