import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* globals.css sets `scroll-behavior: smooth` on html. This tells the
         router the smooth scroll is deliberate, so it suspends it during
         route transitions instead of fighting scroll restoration. */
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:border focus:border-amber focus:bg-void focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:text-amber"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScanlineOverlay />
      </body>
    </html>
  );
}
