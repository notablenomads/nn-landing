import React from "react";
import { motion } from "framer-motion";
import ContactForm from "@/components/landing/contact/contactForm";

function Contact() {
  return (
    <section className="w-full min-h-screen bg-[#121212] py-16" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-5xl font-bold tracking-tight text-white mb-4">Contact</h2>
          <p className="text-center text-md text-gray-500 mb-5">We're available for new projects</p>

          <motion.a
            href="mailto:contact@notablenomads.com"
            drag
            dragConstraints={{ left: -2, right: 2, top: -2, bottom: 2 }}
            dragElastic={0.7}
            whileHover={{
              scale: 1.1,
              textShadow: "0px 0px 8px rgb(255,255,255)",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="font-light text-5xl md:text-6xl my-3 cursor-pointer text-white">Say Hello</p>
          </motion.a>
          <p className="my-4 opacity-80">Or</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
