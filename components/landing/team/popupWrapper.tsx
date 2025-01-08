import React, {useState} from 'react';
import SlidingPopup from "@/components/landing/team/popup";
import {Button} from "@/components/ui/button";

interface PopupWrapperProps {
    title: string;
    children: React.ReactNode;
}
function PopupWrapper({title,children}:PopupWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button className='bg-transparent mt-1' onClick={() => setIsOpen(true)}>About</Button>
            <SlidingPopup isOpen={isOpen} title={title} onClose={() => setIsOpen(false)}>
                {children}
            </SlidingPopup></>
    );
}

export default PopupWrapper;