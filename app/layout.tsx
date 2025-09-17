import type { Metadata } from "next";
import { Nunito, Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const bricolageGrotesqueCondensed = localFont({
  variable: "--font-bricolage-grotesque-condensed",
  src: [
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/webfonts/bricolage-grotesque-condensed/BricolageGrotesque48ptCondensed-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "TastyFruit Admin",
  description: "Administrative dashboard for TastyFruit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${bricolageGrotesque.variable} ${bricolageGrotesqueCondensed.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
