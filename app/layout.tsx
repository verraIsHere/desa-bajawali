import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-editorial",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Desa Bajawali",
  description: "Portal informasi resmi Desa Bajawali, Kecamatan Lariang, Kabupaten Pasangkayu, Sulawesi Barat.",
  // Icons are provided by the file conventions in this directory:
  // app/favicon.ico, app/icon.png, app/apple-icon.png
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${manrope.variable} ${sourceSerif4.variable} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
