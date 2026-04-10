import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { getSingleType } from '@/lib/strapi';
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

export const metadata = {
  title: {
    default: "CybroSecurity - Cybersecurity Solutions",
    template: "%s | CybroSecurity", // This adds "| CybroSecurity" to all page titles
  },
  description: "Professional cybersecurity solutions and services to protect your digital assets",
  keywords: ["cybersecurity", "security", "IT security", "cyber protection"],
};

export default async function RootLayout({ children }) {

  const homepage = await getSingleType('homepage');

  const content = Array.isArray(homepage?.content) ? homepage.content : [];
  const navbar = content.find((item) => item?.__component === 'structure.navbar') || null;
  const footer = content.find((item) => item?.__component === 'structure.footer') || null;

  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable}`}>
        {navbar && <Navbar data={navbar} />}
        {children}
        {footer && <Footer data={footer} />}
      </body>
    </html>
  );
}
