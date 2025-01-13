import React from 'react';
import {motion} from 'framer-motion';
import ContactForm from "@/components/landing/contact/contactForm";

function Contact() {
    return (
        <div className='text-center flex justify-center items-center flex-col min-h-dvh' id='contact'>
            <h2 className="text-5xl text-center font-bold tracking-tight text-white mb-4"
            >Contact</h2>
            <p className='text-center text-md text-gray-600 mb-5'>We're available for the new projects</p>
            <motion.a href='mailto:contact@notablenomads.com'
                      drag
                      dragConstraints={{left: -2, right: 2, top: -2, bottom: 2}}
                      dragElastic={0.7}
                      whileHover={{
                          scale: 1.1,
                          textShadow: "0px 0px 8px rgb(255,255,255)",
                          transition: {duration: 0.3}
                      }}
                      whileTap={{scale: 0.95}}
            >
                <p className='font-light text-6xl my-3 cursor-pointer'>Say Hello</p>
            </motion.a>
            <p className='my-4 opacity-80'>Or</p>
            <ContactForm/>
        </div>
    );
}

export default Contact;