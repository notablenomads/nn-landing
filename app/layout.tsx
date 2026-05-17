import type { Metadata } from "next";
import "./app.css";
import { SerwistProvider } from "@serwist/turbopack/react";
import { RevolutionGothicFont } from "@/public/fonts/rev";
import GoogleAnalytics from "./googleAnalytics";
import { NavigationEvents } from "./navigatonEvent";
import ThreePatch from "@/components/providers/ThreePatch";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Notable Nomads",
  description:
    "Notable Nomads Runs by a growing team of freelancers, all sharing the same passion for producing high-end work in their, Our expertise spans Custom Application Development, Web Development, Enterprise Software Solutions, and UI/UX Design, ensuring end-to-end technical excellence tailored to your business needs.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`overflow-x-hidden ${RevolutionGothicFont.className}`}
    >
      <body>
        <ThreePatch>
          <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>
        </ThreePatch>
        <GoogleAnalytics />
        <Suspense>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  );
}
