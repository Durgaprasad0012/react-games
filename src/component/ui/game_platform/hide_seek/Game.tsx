import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Bet from "./Bet";
import { getRandomMultiplier } from "../../../../utils/GetRandomMultiplayer";

interface HideSeek {
    wallet: number;
    setWallet: React.Dispatch<React.SetStateAction<number>>;
}

const Game: React.FC<HideSeek> = ({ wallet, setWallet }) => {
    const [betAmount, setBetAmount] = useState<number>(10);
    const [winningBoxes, setWinningBoxes] = useState<number[]>([]);
    const [isClicked, setIsClicked] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [startCountdown, setStartCountdown] = useState<number>(3);
    const [isBet, setIsBet] = useState<boolean>(true);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    // fixed IDs for boxes 0..35
    const boxes = useMemo(() => Array.from({ length: 36 }, (_, i) => i), []);

    // current visible order (we animate changes to this)
    const [order, setOrder] = useState<number[]>(boxes);

    const shuffle = () => {
        setOrder((prev) => {
            const a = [...prev];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        });
    };

    // 🔹 Start countdown (3..2..1..Go)
    useEffect(() => {
        if (isBet) return;
        if (startCountdown === 0) {
            setGameStarted(true); // ✅ allow playing
            setTimeLeft(15);
            setIsClicked(true);
            return;
        }
        shuffle();
        const timer = setTimeout(() => {
            setStartCountdown((prev) => prev - 1);
            
        }, 1000);

        return () => clearTimeout(timer);
    }, [startCountdown, isBet]);

    const handleClick = (index: number) => {
        const rand = Math.floor(Math.random() * order.length);
        // const rand = Math.floor(Math.random() * 5);
        if (rand === index) {
            if (!winningBoxes.includes(rand)) {
                setWinningBoxes((prev) => [...prev, index]);
            }
        }
    };

    useEffect(() => {
        let lastTouch = 0;
        const preventDoubleTapZoom = (e: TouchEvent) => {
            const now = Date.now();
            if (now - lastTouch <= 300) e.preventDefault();
            lastTouch = now;
        };
        document.addEventListener("touchend", preventDoubleTapZoom, { passive: false });
        return () => document.removeEventListener("touchend", preventDoubleTapZoom);
    }, []);

    useEffect(() => {
        if (!isClicked) return;
        if (timeLeft === 0) {
            setIsClicked(false);
            return;
        }
        const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, isClicked]);

    const handleBack = () => {
        const matchPoint = winningBoxes.length * 1.8;
        setIsBet(true);
        setIsClicked(null);
        setTimeLeft(15);
        setWinningBoxes([]);
        setWallet((prev) => prev + matchPoint * betAmount);
        setGameStarted(false);
        setStartCountdown(3);
        // optional: reset order
        setOrder(boxes);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="mb-4 text-xl font-bold">Hide &amp; Seek</h1>

            {isBet ? (
                <Bet
                    wallet={wallet}
                    betAmount={betAmount}
                    setBetAmount={setBetAmount}
                    setWallet={setWallet}
                    setIsBet={setIsBet}
                />
            ) : (
                <div className="relative">
                    <div className={`text-lg md:text-xl flex justify-center ${timeLeft <= 3 ? "animate-pulse text-red-500" : "text-white"}`}>
                        <span>00:{String(timeLeft).padStart(2, "0")}</span>
                    </div>

                    <div className="flex items-center justify-center mb-3 gap-3">
                        <p className="text-center sm:text-2xl">points : {winningBoxes.length}</p>

                    </div>

                    {/* Animated grid container */}
                    <motion.div
                        layout
                        className="grid grid-cols-6 gap-2 rounded relative"
                        transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                    >
                        {order.map((boxId) => {
                            const isWin = winningBoxes.includes(boxId);
                            return (
                                <motion.button
                                    key={boxId}
                                    layout
                                    disabled={isWin}
                                    onClick={() => handleClick(boxId)}
                                    whileTap={{ scale: 0 }}
                                    className={`w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center border rounded  select-none
                    ${isWin ? "bg-blue-500 cursor-not-allowed text-white font-bold animate-pulse" : "bg-white/20 hover:bg-white/30 active:scale-95 transition cursor-pointer"}
                  `}
                                    transition={{ layout: { duration: 0.5 } }}
                                >
                                    {isWin ? `1.8x` : boxId + 1}
                                </motion.button>
                            );
                        })}

                        {isClicked === false && (
                            <div className="w-full h-full absolute left-0 top-0 bg-black/80 rounded flex flex-col justify-center items-center">
                                <p className="text-center text-3xl font-bold">Game Over</p>
                                <p className="text-lg font-bold pb-5">Your Points : {winningBoxes.length}</p>
                                <button onClick={handleBack} className="bg-blue-500 p-3 rounded font-bold">
                                    Play Again
                                </button>
                            </div>
                        )}

                        {!gameStarted && (
                            <div className="w-full h-full absolute left-0 top-0 bg-black/80 rounded">
                                <span className="animate-bounce absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-400">
                                    {startCountdown > 0 ? startCountdown : "GO!"}
                                </span>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Game;
