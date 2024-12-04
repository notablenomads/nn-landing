"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "1%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        width: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, top: 100 }}
        animate={{ opacity: 1, top: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Image src="/nn-logo.svg" alt="logo" width={65} height={65} layout="" />
      </motion.div>
    </div>
  );
};

export default Header;
