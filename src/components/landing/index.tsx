"use client";
import React, { useState } from "react";
import FirstSection from "./firstSection";
import SecondSection from "./secondSection";
import ProgressLogoLoader from "../loader";

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
        </>
      )}
    </>
  );
};

export default Landing;
