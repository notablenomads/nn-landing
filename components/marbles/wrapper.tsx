"use client";

import dynamic from "next/dynamic";

const TubesAnimation = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />,
});

export default function ClientPage() {
  return <TubesAnimation />;
}
