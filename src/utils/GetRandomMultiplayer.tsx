export const getRandomMultiplier = () => {
    const random = Math.random() * 100; // gives 0–99.999...

    if (random < 1) {
        return "9"; // 1% chance
    } else if (random < 21) {
        return "4.5"; // next 20% chance
    } else {
        return "1.8"; // remaining 79%
    }
}