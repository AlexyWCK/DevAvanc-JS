import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/* CSS from libraries */
import '@realtime-elo-ranker/libs/ui/styles';

const poppinsRegular = Poppins({
  weight: "400",
  style: "normal",
  variable: "--poppins-regular",
});

export const metadata: Metadata = {
  title: "Realtime Elo Ranker",
  description: "Support de TP pour le cours de développement avancé en NodeJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppinsRegular.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
