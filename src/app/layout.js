import { Geist, Geist_Mono, Bebas_Neue, Unkempt, Jersey_15 } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { getGlobal } from '@/lib/strapi';
import "./globals.scss";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unkempt = Unkempt({
  variable: "--font-unkempt",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jersey15 = Jersey_15({
  variable: "--font-jersey-15",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cybrosecurity.com'),
  title: {
    default: "CybroSecurity - Cybersecurity Solutions",
    template: "%s | CybroSecurity", // This adds "| CybroSecurity" to all page titles
  },
  description: "Professional cybersecurity solutions and services to protect your digital assets",
  keywords: ["cybersecurity", "security", "IT security", "cyber protection"],
  openGraph: {
    title: "CybroSecurity - Cybersecurity Solutions",
    description: "Professional cybersecurity solutions and services to protect your digital assets",
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CybroSecurity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "CybroSecurity - Cybersecurity Solutions",
    description: "Professional cybersecurity solutions and services to protect your digital assets",
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
};

export default async function RootLayout({ children }) {

  const siteSettings = await getGlobal();
  const navbar = siteSettings?.navbar ?? null;
  const footer = siteSettings?.footer ?? null;

  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${unkempt.variable} ${jersey15.variable}`}>
        {navbar && <Navbar data={navbar} />}
        {children}
        {footer && <Footer data={footer} />}
      </body>
    </html>
  );
}
