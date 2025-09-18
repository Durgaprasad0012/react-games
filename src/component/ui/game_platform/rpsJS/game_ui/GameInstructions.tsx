import React from 'react';
import Rock from '../../../../../assets/img/rock.png'
import paper from '../../../../../assets/img/paper.png'
import scissor from '../../../../../assets/img/scissor.png'

interface ShowInstructions {
    setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameInstructions: React.FC<ShowInstructions> = ({ setShowInstructions }) => {
    return (
        <div className="fixed z-50 w-full md:w-200 left-1/2 transform -translate-x-1/2 flex justify-center items-center px-5">
            <div className="w-full h-full max-w-2xl mx-auto p-4 md:p-6 lg:p-8 bg-white/50 rounded-xl text-white shadow-lg backdrop-blur-md overflow-y-auto max-h-[80vh]">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-white">
                    🎮 How to Play: Rock Paper Scissors
                </h2>
                <ul className="list-disc list-inside space-y-4 text-black/90 text-sm md:text-base">
                    <li>
                        <strong>Choose Your Bet Amount</strong><br />
                        Before starting, select the amount you want to bet. This amount will be used in the current game session.
                    </li>
                    <li>
                        <strong>Click the "Shoot" Button</strong><br />
                        After setting your bet, press <em>Shoot</em> to enter the game arena.
                    </li>
                    <li>
                        <strong>Select Your Move</strong><br />
                        Choose one of the following:
                        <ul className="list-disc flex justify-center list-inside ml-4">
                            <li className='mx-auto flex items-end'><img src={Rock} alt="" className="w-10 object-contain" /> Rock</li>
                            <li className='mx-auto flex items-end'><img src={paper} alt="" className="w-10 object-contain" /> Paper</li>
                            <li className='mx-auto flex items-end'><img src={scissor} alt="" className="w-10 object-contain" /> Scissors</li>
                        </ul>
                        The computer will randomly select a different move.
                    </li>
                    <li>
                        <strong>Game Rules</strong><br />
                        Rock beats Scissors, Paper beats Rock, Scissors beats Paper.
                    </li>
                    <li>
                        <strong>Winning Conditions</strong><br />
                        <ul className="list-disc list-inside ml-4">
                            <li>Win 3 times to end the game early with a victory</li>
                            <li>If neither wins 3 rounds, the game ends after 5 rounds</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Game Result</strong><br />
                        If you win: 🎉 Earn <strong>1.8×</strong> your bet amount!<br />
                        If you lose: 😢 You lose the bet.
                    </li>
                    <li>
                        <strong>Restart</strong><br />
                        After the game ends, tap <em>Play Again</em> to restart with a new bet.
                    </li>
                </ul>
                <div className="mt-6 text-center text-sm text-gray-600 italic">
                    💡 The computer never picks the same move as you — no draws!
                </div>
                <button className="mx-auto cursor-pointer bg-blue-500 p-2 rounded-lg" onClick={() => setShowInstructions(false)}>
                    Got it
                </button>
            </div>

        </div>
    );
};

export default GameInstructions;
