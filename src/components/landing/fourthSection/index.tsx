import React from 'react';
import { motion } from 'framer-motion';

function FourthSection() {
    return (
        <div className='text-center h-96 flex justify-center items-center flex-col' id='contact'>
            <h2 className='text-center text-4xl'>Contact</h2>
            <p className='text-center text-gray-600'>We're available for the new projects</p>
            <motion.a href='mailto:contact@notablenomads.com'
                drag
                dragConstraints={{ left: -2, right: 2, top: -2, bottom: 2 }}
                dragElastic={0.7}
                whileHover={{
                    scale: 1.1,
                    textShadow: "0px 0px 8px rgb(255,255,255)",
                    transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
            >
                <p className='font-light text-7xl my-3 cursor-pointer'>Say Hello</p>
            </motion.a>
        </div>
    );
}

export default FourthSection;