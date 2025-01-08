"use client";
import React, { useState } from "react";
import Jumbo from "./jumbo";
import Team from "./team";
import ProgressLogoLoader from "../loader";
import OurServices from "./ourServices";
import Contact from "./contact";
// import BlogSection from "@/components/landing/blog";

const Landing: React.FC = () => {
  const [done, setDone] = useState(false);
  const handleDone = () => setDone(true);
  return (
    <>
      {!done ? (
        <ProgressLogoLoader doneCallback={handleDone} />
      ) : (
        <>
          <Jumbo />
          <Team />
          <OurServices />
          {/*<BlogSection />*/}
          <Contact />
        </>
      )}
    </>
  );
};

export default Landing;
