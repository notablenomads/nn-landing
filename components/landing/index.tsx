"use client";
import React, { useState } from "react";
import Jumbo from "./jumbo";
import Team from "./team";
import ProgressLogoLoader from "../loader";
import OurServices from "./ourServices";
import Contact from "./contact";
import BlogSection from "./blog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const Landing: React.FC = () => {
  const [done, setDone] = useState(false);
  const handleDone = () => setDone(true);

  return (
    <>
      {!done ? (
        <ProgressLogoLoader doneCallback={handleDone} />
      ) : (
        <>
          <QueryClientProvider client={queryClient}>
            <Jumbo />
            <Team />
            <OurServices />
            <BlogSection />
            <Contact />
          </QueryClientProvider>
        </>
      )}
    </>
  );
};

export default Landing;
