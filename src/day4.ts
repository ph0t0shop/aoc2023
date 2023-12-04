export async function run(lines: string[]) {
    let pointSum = 0;

    const copies = Array(lines.length).fill(1);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nCopies = copies[i];

        const [winningStr, myStr] = line.substring(line.indexOf(": ") + 2).split(" | ");
        const winningNumbers = new Set(winningStr.split(" ").filter(elem => elem.length));
        const myNumbers = myStr.split(" ").filter(elem => elem.length);

        let numWinning = 0;

        for (const myNumber of myNumbers) {
            if (winningNumbers.has(myNumber)) numWinning++;
        }

        if (numWinning > 0) {
            pointSum += Math.pow(2, numWinning - 1);
        }

        for (let j = i + 1; j < Math.min(lines.length, i + 1 + numWinning); j++) {
            copies[j] += nCopies;
        }
    }

    console.log(pointSum);
    console.log(copies.reduce((a, b) => a + b));
}