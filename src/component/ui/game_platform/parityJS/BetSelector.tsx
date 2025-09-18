import { useEffect, useRef, useState } from "react";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

type BetSelectorType = "color" | "number";
type Color = "green" | "violet" | "red";
const colors: Color[] = ["green", "violet", "red"];
const multipliers: Record<Color, number> = {
    green: 1.8,
    violet: 4.5,
    red: 1.8,
};
interface BetsState {
  color: { value: Color | null; amount: number | null };
  number: { value: number | null; amount: number | null };
}

type BetSelectorProps =
  | {
      type: "color";
      selected: Color | null;
      setSelected: React.Dispatch<React.SetStateAction<Color | null>>;
      setBets: React.Dispatch<React.SetStateAction<BetsState>>;
      setIsStart:React.Dispatch<React.SetStateAction<boolean>>;
      onBet: (amount: number) => void;
    }
  | {
      type: "number";
      selected: number | null;
      setSelected: React.Dispatch<React.SetStateAction<number | null>>;
      setBets: React.Dispatch<React.SetStateAction<BetsState>>;
      setIsStart:React.Dispatch<React.SetStateAction<boolean>>;
      onBet: (amount: number) => void;
    };

const BetSelector: React.FC<BetSelectorProps> = ({
  type,
  selected,
  setSelected,
  setIsStart,
  setBets,
  onBet
}) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isBet, setIsBet] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const options = type === "color" ? colors : Array.from({ length: 10 }, (_, i) => i);
    useEffect(() => {
      setIsBet(false);
      setAmount(null)
    }, [selected == null])
    
    useEffect(() => {
        if (isFocused && Number(amount) < 1) setAmount(1);
        setMessage(Number(amount) > 1000 ? "Please enter a value below 1000" : "");
    }, [isFocused, amount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value === "" ? null : Number(e.target.value);
        setAmount(value);
    };
    const increment = () => setAmount(prev => (prev === null ? 1 : Math.min(prev + 1, 1000)));
    const decrement = () => setAmount(prev => (prev === null ? 1 : Math.max(prev - 1, 1)));

    // Start holding
    const startHolding = (fn: () => void) => {
        fn(); // run once immediately
        intervalRef.current = setInterval(fn, 100); // repeat
    };
    // Stop holding
    const stopHolding = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    const isDisabled = !amount || amount === 0 || amount >= 1001;


    // Handle Bet Press
    const handleBet = () => {
        if (selected !== null && (amount ?? 0) > 0) {
            setIsBet(true);
            setBets(prev => ({
                ...prev,
                [type]: {
                    value: selected as any,
                    amount
                }
            }));
            onBet(amount ?? 0);
        }
    };
    return (
        <div className="w-full flex flex-col gap-x-3 items-center">
            {/* Options */}
            <div className="flex flex-wrap justify-center items-center gap-2 py-2">
                {options.map((option :any, index) => {
                    const baseClasses = "p-3 rounded-md cursor-pointer min-w-[60px] text-center";
                    const selectedClasses = "border-2 border-white shadow-lg scale-105 opacity-100";
                    return (
                        <div
                            key={index}
                            onClick={() => {setSelected(option),setIsStart(true)}}
                            className={`
                                    ${baseClasses}
                                    bg-gradient-to-b from-${option}-500 to-[--light] relative
                                    ${selected === option ? selectedClasses : 'bg-white/10'}
                                `}
                        >
                            {type === "color" ? (
                                <>
                                    <p className="capitalize">{option}</p>
                                    <p className="text-xs">{multipliers[option as Color]}x</p>
                                </>
                            ) : (
                                <p>{option}</p>
                            )}
                        </div>
                    )
                })}
                {type === "number" &&
                    <p className="w-full text-center">9x</p>
                }
            </div>

            {/* Bet amount controls */}
            <div className="flex justify-center h-20 flex-wrap items-center gap-x-1 px-3 sm:px-20 md:w-200">
                <ArrowBigLeftDash
                    className={`active:text-white/50 ${isBet && "hidden"} ${Number(amount) <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}`}
                    onMouseDown={() => startHolding(decrement)}
                    onMouseUp={stopHolding}
                    onMouseLeave={stopHolding}
                    onTouchStart={() => startHolding(decrement)}
                    onTouchEnd={stopHolding}

                />
                <input
                    type="number"
                    placeholder="enter amount"
                    value={amount ?? ""}
                    readOnly={isBet}
                    onFocus={(e) => {
                        setIsFocused(true);
                        e.target.select();
                    }}
                    onBlur={() => setIsFocused(false)}
                    onChange={handleChange}
                    className="text-center p-1 border-1 cursor-text border-white/50 w-1/2 sm:w-30  rounded"
                />
                <ArrowBigRightDash
                    className={`active:text-white/50 ${isBet && "hidden"}  ${Number(amount) >= 1000 ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}`}
                    onMouseDown={() => startHolding(increment)}
                    onMouseUp={stopHolding}
                    onMouseLeave={stopHolding}
                    onTouchStart={() => startHolding(increment)}
                    onTouchEnd={stopHolding}
                />
                <div className="w-full">
                    {!isBet &&
                        <button
                            disabled={selected === null}
                            onClick={handleBet}
                            className={`mx-auto block mt-2 p-2 rounded-lg bg-black/50 active:bg-black/20 ${isDisabled ? "hidden" : ""}`}
                        >
                            bet
                        </button>
                    }
                </div>
                {message &&
                    <p className="w-full text-sm text-red-500 text-center">{message}</p>
                }

            </div>

        </div>
    );
};

export default BetSelector;
