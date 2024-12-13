"use client";
import React, { useState } from "react";
import FirstSection from "./firstSection";
import SecondSection from "./secondSection";
import ProgressLogoLoader from "../loader";
import ThirdSection from "./thirdSection";
import FourthSection from "@/src/components/landing/fourthSection";

const Landing: React.FC = () => {
  const [done, setDone] = useState(false);
  const handleDone = () => setDone(true);
  return (
    <>
      {!done ? (
        <ProgressLogoLoader doneCallback={handleDone} />
      ) : (
        <>
          <FirstSection />
          <SecondSection />
          <ThirdSection />
          <FourthSection/>
        </>
      )}
    </>
  );
};

export default Landing;
