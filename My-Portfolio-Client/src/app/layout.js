import "./globals.css";
import { Providers } from "@/components/providers/ThemeProvider";
import PagePreloader from "@/components/common/PagePreloader";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000"),
  title: "B.M. Jifan Mahmud | Full-Stack Web Developer",
  description:
    "Official portfolio of B.M. Jifan Mahmud, Full-Stack Web Developer specialized in React.js, Next.js, Node.js, Express.js, and MongoDB. Explore projects, skills, and get in touch.",
  keywords: [
    "B.M. Jifan Mahmud",
    "Jifan Mahmud",
    "Full-Stack Web Developer",
    "MERN Stack Developer",
    "Next.js Developer",
    "Barisal Polytechnic Institute",
    "Portfolio",
  ],
  authors: [{ name: "B.M. Jifan Mahmud" }],
  creator: "B.M. Jifan Mahmud",
  openGraph: {
    title: "B.M. Jifan Mahmud | Full-Stack Web Developer",
    description:
      "Crafting high-performance, modern web applications with Next.js, Node.js, and MongoDB.",
    url: "https://jifanmahmud.com",
    siteName: "B.M. Jifan Mahmud Portfolio",
    images: [
      {
        url: "/assets/jifan1.png",
        width: 1200,
        height: 630,
        alt: "B.M. Jifan Mahmud - Full-Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>
          <PagePreloader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
