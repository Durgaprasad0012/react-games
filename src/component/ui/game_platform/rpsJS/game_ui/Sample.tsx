import React, { useEffect, useState } from 'react';
import './sample.css';
import Rock from "../../../../../assets/img/0.png";
import Paper from "../../../../../assets/img/5.png";
import Scissor from "../../../../../assets/img/2.png";

import rocks_icon from "../../../../../assets/img/rock.png";
import papers_icon from "../../../../../assets/img/paper.png";
import scissor_icon from "../../../../../assets/img/scissor.png";


interface Bet {
    betAmount: number;
    setWalletAmount: React.Dispatch<React.SetStateAction<number>>;
    setIsLoadFirst: React.Dispatch<React.SetStateAction<boolean>>;
}

const choices = [
    { name: 'rock', image: Rock },
    { name: 'paper', image: Paper },
    { name: 'scissor', image: Scissor },
];
const gameChoices = [
    { name: 'rock', image: rocks_icon },
    { name: 'paper', image: papers_icon },
    { name: 'scissor', image: scissor_icon },
];

const getResult = (player: string, computer: string) => {
    if (
        (player === 'rock' && computer === 'scissor') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissor' && computer === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
};

const RockPaperScissors: React.FC<Bet> = ({ betAmount, setWalletAmount, setIsLoadFirst }) => {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const [score, setScore] = useState({ win: 0, lose: 0 });
    const [playCount, setPlayCount] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isStart, setIsStart] = useState<boolean>(false);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [finalResult, setFinalResult] = useState<"win" | "lose" | null>(null);

    const handleClick = (choice: string) => {
        setIsStart(true);
        setSelectedChoice(choice);
        if (isShaking || isGameOver) return;

        setIsShaking(true);
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);

        const filteredChoices = choices.filter(c => c.name !== choice);
        const compChoice = filteredChoices[Math.floor(Math.random() * filteredChoices.length)].name; // web socket random content👈🏻
        setTimeout(() => {
            setIsStart(false);
            const result = getResult(choice, compChoice);

            setPlayerChoice(choice);
            setComputerChoice(compChoice);
            setResult(result);
            setIsShaking(false);

            setScore((prev) => ({
                ...prev,
                [result]: prev[result as keyof typeof prev] + 1,
            }));

            setPlayCount(prev => {
                const newCount = prev + 1;
                return newCount;
            });
        }, 2500);
    };

    useEffect(() => {
        if (result) {
            setTimeout(() => {
                setResult(null);
                setSelectedChoice(null);
            }, 1000);
        }
        if (score.win === 3 || score.lose === 3 || playCount > 6) {
            setIsGameOver(true);
            if (score.win === 3) {
                setFinalResult("win");
                setWalletAmount(prev => prev + (betAmount * 1.8));
            } else {
                setFinalResult("lose");
            }

        }
    }, [score, playCount]);

    const getImage = (name: string | null) => {
        if (!name) return '';
        return choices.find((c) => c.name === name)?.image || '';
    };



    const resetGame = () => {
        setIsLoadFirst(true);
        setPlayCount(0);
        setIsGameOver(false);
        setScore({ win: 0, lose: 0 });
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    return (
        <div className="relative game-container w-full h-screen flex flex-col justify-end items-center">


            <div className="result-container absolute top-1/3 transform -translate-y-1/3 ">
                <div className={`hand`}>
                    <div>
                        <img src={!playerChoice ? Rock : getImage(playerChoice)} alt="you" className={`object-contain w-80 md:w-100 rotate-45 ${isStart ? "shake" : "shake2"}`} />
                        <p className='text-xl'>You</p>
                    </div>
                </div>
                <div className={`hand`}>
                    <div>
                        <img src={!computerChoice ? Rock : getImage(computerChoice)} alt="comp" className={`object-contain w-80 md:w-100 -rotate-45 ${isStart ? "shake" : "shake2"}`} />
                        <p className='text-xl'>Computer</p>
                    </div>
                </div>
            </div>

            {result && (
                <div className="result-text  absolute top-25 ">
                    <h3
                        className={`z-1 bg-white/40 rounded-lg p-2 md:px-4 md:py-2`}
                    >{result === 'win' ? 'You Win!' : 'You Lose!'}</h3>
                </div>
            )}

            <div className="score-board absolute top-5">
                <h4>Score</h4>
                <div className="w-full md:w-200 flex justify-center items-center gap-x-10 text-xl">
                    <p>Win: {score.win}</p>
                    <p>Lose: {score.lose}</p>
                </div>
            </div>

            {!isStart && !isGameOver && <p className='w-full text-center mb-5 px-2'>please select the choice below</p>}
            <div className="choices pb-20 md:pb-30">
                {gameChoices.map((choice) => (
                    <button
                        key={choice.name}
                        onClick={() => handleClick(choice.name)}
                        disabled={isGameOver}
                        className={`${selectedChoice === choice.name ? "scale-115 opacity-100" : "opacity-50"}`}
                    >
                        <img src={choice.image} alt={choice.name} />
                        <p>{choice.name}</p>
                    </button>
                ))}
            </div>
            {isGameOver && (
                <div className="game-over absolute w-screen h-screen flex flex-col justify-center items-center gap-y-2 px-2">
                    <div className="w-full md:w-100 blur-box p-2 flex flex-col justify-center items-center gap-y-2 ">
                        <p className="text-2xl font-bold ">
                            {finalResult === "win" ? "Congratulations" : "You Lose!"}
                        </p>
                        <h3>Game Over</h3>
                        <button className='bg-black/50 p-2 rounded-lg' onClick={resetGame}>Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RockPaperScissors;
