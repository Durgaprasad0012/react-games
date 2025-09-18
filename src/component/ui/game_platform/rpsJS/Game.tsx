import { useEffect, useState } from "react"
import BetPage from "./game_ui/BetPage";
import GameInstructions from "./game_ui/GameInstructions";
import RockPaperScissors from "./game_ui/Sample";
interface Wallet {
  wallet: number;
  setWallet: React.Dispatch<React.SetStateAction<number>>;

}
const Game: React.FC<Wallet> = ({ wallet, setWallet }) => {
  const [isLoadFirst, setIsLoadFirst] = useState<boolean>(true);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(true);

 useEffect(() => {
   const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 20000); // 10 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);
  

  return (
    <div>
      {showInstructions && <GameInstructions setShowInstructions={setShowInstructions} />}
      {isLoadFirst ?
        <BetPage
          wallet={wallet}
          setIsLoadFirst={setIsLoadFirst}
          setWalletAmount={setWallet}
          setBetAmount={setBetAmount}
        />
        :
        <div className="">
          <RockPaperScissors
            betAmount={betAmount}
            setWalletAmount={setWallet}
            setIsLoadFirst={setIsLoadFirst}
          />
        </div>
      }

    </div>
  )
}

export default Game