import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./app.css";

const mont = Montserrat({
  subsets: ['latin'],
  // You can specify different weights if needed
  weight: ['300','400', '500', '600', '700'],
})
export const metadata: Metadata = {
  title: "Notable Nomads",
  description: "Code Without Borders",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`overflow-x-hidden ${mont.className}`}>
        <body>{children}</body>
    </html>
  );
}
