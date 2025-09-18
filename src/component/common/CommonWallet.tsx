import React from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { CirclePoundSterling } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Titles {
    game?: string;
    wallet: number;
    setGames:React.Dispatch<React.SetStateAction<string>>
    setIsClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommonWallet: React.FC<Titles> = ({ game,wallet, setIsClick, setGames }) => {
    const navigate = useNavigate();
    
    // Create a motion value for the wallet
    const walletValue = useMotionValue(wallet);

    // Animate the motion value toward the new wallet value
    const animated = useSpring(walletValue, { stiffness: 100, damping: 20 });

    // Transform the animated value to a formatted number
    const displayValue = useTransform(animated, (latest) =>
        latest.toFixed(0)
    );

    // Update when wallet changes
    React.useEffect(() => {
        walletValue.set(wallet);
    }, [wallet, walletValue]);

    return (
        <div className="w-full flex justify-between items-center z-15 px-5">
            <p onClick={()=>{navigate(-1), setIsClick(false), setGames("Games")}} className="text-md font-mono cursor-pointer">{game || "Game"}</p>

            <div className="text-sm font-mono flex items-center gap-x-1">
                <CirclePoundSterling className="w-4" />
                <motion.p >
                    {displayValue}
                </motion.p>
            </div>
        </div>
    );
};

export default CommonWallet;
