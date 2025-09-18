import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface Bet {
  wallet: number;
  setIsLoadFirst: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletAmount: React.Dispatch<React.SetStateAction<number>>;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
}

const BetPage: React.FC<Bet> = ({
  wallet,
  setWalletAmount,
  setIsLoadFirst,
  setBetAmount,
}) => {

  const [betValue, setBetValue] = useState<number>(10);


  // const handleIncrement = () => setBetValue((prev) => prev === 1 ? prev + 9 : prev + 10);
  // Increment: (first digit + 1) * 10
  const handleIncrement = () => {
    setBetValue((prev) => {
      const firstDigit = Number(String(prev)[0]);
      const incremented = (firstDigit + 1) * 10;
      return incremented;
    });
  };
  const handleDecrement = () => { setBetValue((prev) => Math.max(prev - 10, 1)) };

  const handleBet = (): void => {
    if (betValue === 0) setBetValue(1);
    if (wallet > betValue) {
      setIsLoadFirst(false);
      setBetAmount(betValue)
      setWalletAmount(prev => prev - betValue);
    } else {
      setBetAmount(10);
    }
  };


  return (
    <div className="w-full h-[50vh] relative ">
      <div className="backdrop-blur-md absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-60 md:w-80 lg:w-100">
        {/* Bet Amount Control */}
        <div className="grid grid-cols-3 items-center justify-items-center gap-4 mb-3">
          <button
            onClick={handleDecrement}
            className={`p-2 text-black rounded 
              ${betValue === 1
                ? "scale-95 active:scale-0 cursor-not-allowed bg-white/20"
                : "cursor-pointer bg-white/50 transform hover:scale-95 active:scale-95 active:bg-white/40"}
            `}
          >
            <Minus />
          </button>
          <input
            type="number"
            value={betValue}
            placeholder="Enter amount"
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => {
              const raw = e.target.value;
              const value = Number(raw);

              // Allow empty input temporarily
              if (raw === '') {
                setBetValue(0);
                return;
              }

              // Only update if it's a positive number
              if (!isNaN(value)) {
                setBetValue(value <= 0 ? 1 : value);
              }
            }}
            min={1}
            inputMode="numeric"
            className="text-center border border-gray-300 rounded w-20 sm:w-24 md:w-28 lg:w-32 py-2 bg-white/50"
          />

          <button
            onClick={handleIncrement}
            className="p-2 bg-white/50 text-black rounded hover:bg-white/20 transform hover:scale-95 active:scale-95 active:bg-white/40"
          >
            <Plus />
          </button>
        </div>

        <p className="text-center text-white">1.8x</p>

        <button
          onClick={handleBet}
          className={`px-5 py-3 block mx-auto rounded font-bold mt-5 transition-all duration-300 bg-white/80 text-black hover:bg-white/90 active:opacity-100`}
        >
          Shoot
        </button>
      </div>
    </div>
  );
};

export default BetPage;
