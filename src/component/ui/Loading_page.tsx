import React, { useEffect, useState } from "react";
import Load from '../../assets/img/loading.gif'
const LoadingPage: React.FC = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade-out after a delay
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 3000); // fade starts after 1s
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black flex justify-center items-center text-white text-xl font-bold transition-opacity duration-700 ease-in-out z-50
            ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            <img src={Load} alt="" />
        </div>
    );
};

export default LoadingPage;
