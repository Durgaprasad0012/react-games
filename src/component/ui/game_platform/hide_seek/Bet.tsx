interface BetProps {
    wallet: number;
    betAmount: number;
    setWallet: React.Dispatch<React.SetStateAction<number>>;
    setIsBet: React.Dispatch<React.SetStateAction<boolean>>;
    setBetAmount: React.Dispatch<React.SetStateAction<number>>;

}

const Bet: React.FC<BetProps> = ({ wallet,betAmount, setIsBet, setWallet, setBetAmount }) => {
    const handleBet = () => {
        if (betAmount > wallet || betAmount < 10) return;
        setWallet(prev=>prev - betAmount);
        setIsBet(false);
    }
    const increaseBet = () => setBetAmount(prev => Math.min(prev === 10 ? prev + 90 : prev + 100, wallet));
    const decreaseBet = () => setBetAmount(prev => Math.max(prev - 100, 10));


    return (
        <div className="w-full flex justify-center items-center gap-3 p-5">
            {/* Decrement */}
            <div className="bg-white/10 p-6 rounded shadow-md text-center">
                <h2 className="text-2xl mb-4">Place Your Bet</h2>
                <div className="flex justify-center items-center mb-4">
                    <button onClick={decreaseBet} className="bg-black/20 text-white px-4 py-2 rounded mr-2 hover:bg-red-600">-</button>
                    <span className="text-xl mx-4 w-10">${betAmount}</span>
                    <button onClick={increaseBet} className="bg-black/20 text-white px-4 py-2 rounded ml-2 hover:bg-green-600">+</button>
                </div>
                <button onClick={handleBet} disabled={betAmount > wallet || betAmount < 10} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">Bet</button>
                {betAmount > wallet && <p className="text-red-500 mt-2">Insufficient wallet balance!</p>}
            </div>
        </div>
    );
};

export default Bet;
