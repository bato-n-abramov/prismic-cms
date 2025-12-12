import localFont from "next/font/local";
import { createClient } from "@/prismicio";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LenisProvider from "@/providers/LenisProvider";
import "./globals.scss";

const plusJakarta = localFont({
  src: [
    {
      path: "../fonts/PlusJakarta/PlusJakarta.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-plus-jakarta",
});

const montserrat = localFont({
  src: [
    {
      path: "../fonts/Montserrat/Montserrat.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
});

const arial = localFont({
  src: [
    {
      path: "../fonts/Arial/Arial.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arial",
});

export const metadata = {
  title: {
    default: "Stepwise",
    template: "%s | Stepwise",
  },
  description: "Stepwise — Prismic",
};

export default async function RootLayout({ children }) {
  const client = createClient();

  let settings = null;

  try {
    const doc = await client.getSingle("site_settings");
    settings = doc.data;
  } catch (e) {
    console.warn("Site settings not found or not published:", e.message);
  }

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${montserrat.variable} ${arial.variable}`}
    >
      <body>
        <LenisProvider>
          <Header settings={settings} />
          {children}
          <Footer settings={settings} />
        </LenisProvider>
      </body>
    </html>
  );
}
