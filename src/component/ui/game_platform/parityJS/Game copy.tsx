import { useEffect, useState } from "react";
import BetSelector from "./BetSelector";

type Color = 'green' | 'violet' | 'red' | null;
type WinningColor = "greenviolet" | "redviolet" | "green" | "red";

const initialBets = {
    color: { value: null as Color, amount: null as number | null },
    number: { value: null as number | null, amount: null as number | null }
};

type ResultMSG = {
    color?: string,
    number?: string
}

interface WalletAmount {
    wallet?: number;
    setWallet: React.Dispatch<React.SetStateAction<number>>;
}
const Game: React.FC<WalletAmount> = ({ wallet, setWallet }) => {

    // Separate selections
    const [selectedColor, setSelectedColor] = useState<Color>(null);
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const [bets, setBets] = useState(initialBets);
    const [isStart, setIsStart] = useState<boolean>(false);

    const [msg, setMsg] = useState<ResultMSG>({ color: undefined, number: undefined });

    const [countDown, setCountDown] = useState<number>(15);

    // Time Fucntions
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (isStart && (selectedColor !== null || selectedNumber !== null)) {
            timer = setInterval(() => {
                setCountDown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setTimeout(() => gameFinished(), 0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setCountDown(15); // reset if not fully selected
        }

        return () => {
            clearInterval(timer);
        };
    }, [selectedColor, selectedNumber, bets]);

    const handleBet = (amount: number) => {
        setIsStart(true);
        if (selectedColor !== null || selectedNumber !== null) {
            setWallet(prev => prev - amount);
        }
    };

    // Game Wining Logic here
    const gameFinished = (): void => {
        // const randomNumber: number = 0;
        const randomNumber = Math.floor(Math.random() * 10); // 0–9

        let winningColor = "";
        if (randomNumber === 0 || randomNumber === 5) {
            winningColor = randomNumber % 2 === 0 ? "green violet" : "red violet";
        } else if (randomNumber % 2 === 0) {
            winningColor = "green";
        } else {
            winningColor = "red";
        }
        // Color Match
        if (bets.color.value) {
            if (winningColor.includes(bets.color.value)) {
                const colorMultiplier = winningColor.includes("violet") ? 4.9 : 1.96;
                setMsg(prev => ({ ...prev, color: "✅ You win!\n Color Match" }));
                setWallet(prev => prev + (Number(bets.color.amount) * colorMultiplier));
            } else {
                setMsg(prev => ({ ...prev, color: `Better luck Next Time!,\n ${winningColor} color not match` }));
            }
        } else {
            setMsg(prev => ({ ...prev, color: `Result Color : ${winningColor.toUpperCase()}` }))
        }
        // Number Match
        if (bets.number.value === null) {
            setMsg(prev => ({ ...prev, number: `Result Number : ${randomNumber}` }))
        } else {
            if (randomNumber == bets.number.value) {
                setMsg(prev => ({ ...prev, number: "✅ You win!\n Number Match" }));
                setWallet(prev => prev + (Number(bets.number.amount) * 9));
            } else {
                setMsg(prev => ({ ...prev, number: `Better luck Next Time!\n  ${randomNumber} Number is not match` }));
            }
        }

        setTimeout(() => {
            setSelectedColor(null);
            setSelectedNumber(null);
            setIsStart(false)
            setMsg({ color: undefined, number: undefined });
        }, 5000);
    };



    return (
        <div className="w-full overflow-y-auto px-5">
            {(msg.color || msg.number) && (
                <div className="absolute left-1/2 top-1/2 transform -translate-1/2 w-full h-screen flex flex-col gap-y-10 justify-center bg-black/60 items-center z-1 p-5 font-black text-sm sm:text-lg rounded">
                    {msg.color && <p className="w-1/2 p-2 rounded-lg flex flex-col justify-center items-center text-center bg-blue-500">
                        <span>{msg.color}</span>
                    </p>}
                    {msg.number && <p className="w-1/2 p-2 rounded-lg flex flex-col justify-center items-center text-center bg-blue-500">
                        <span>{msg.number}</span>
                    </p>}
                </div>
            )}
            {/* Timer */}
            <div className={` text-lg md:text-xl flex justify-center ${countDown <= 3 ? "animate-pulse text-red-500" : "text-white"}`}>
                <span>00:{String(countDown).padStart(2, "0")}</span>
            </div>

            <div className="w-full h-screen overflow-y-auto pb-20 scroll-hide">
                {/* Color Choices */}
                <BetSelector
                    type="color"
                    selected={selectedColor}
                    setSelected={setSelectedColor}
                    setBets={setBets}
                    setIsStart={setIsStart}
                    onBet={handleBet}
                />

                {/* Number Choices */}
                <BetSelector
                    type="number"
                    selected={selectedNumber}
                    setSelected={setSelectedNumber}
                    setBets={setBets}
                    setIsStart={setIsStart}
                    onBet={handleBet}
                />
            </div>
        </div>
    );
};

export default Game;
