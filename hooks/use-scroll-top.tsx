"use client"

import { useState, useEffect } from "react";

export const useScrollTop = (threshold = 10) => {
    const [scrollDirection, setScrollDirection] = useState('up'); // default is up
    
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > threshold) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY && currentScrollY < threshold) {
                setScrollDirection('up');
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrollDirection;
}
