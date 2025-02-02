import type {Metadata} from "next";
import "./app.css";
// import {Toaster} from 'sonner'
import { RevolutionGothicFont } from "@/public/fonts/rev";


export const metadata: Metadata = {
    title: "Notable Nomads",
    description: "Code Without Borders",
     manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`overflow-x-hidden ${RevolutionGothicFont.className}`}>
        {/* <Toaster/> */}
        <body>{children}</body>
        </html>
    );
}
