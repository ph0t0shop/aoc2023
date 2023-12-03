import { writeFile } from "fs/promises";

export async function run(lines: string[]) {
    const lineLength = lines[0].length;
    const numberIDGrid: number[][] = [];
    const numberIDToValueMap: Record<number, number> = {};
    let numberID = 0;

    function containsSymbol(cx: number, cy: number): boolean { // returns true if a 3x3 square centered around x,y contains a symbol, false otherwise
        for (let y = Math.max(cy - 1, 0); y < Math.min(cy + 2, lines.length); y++) {
            for (let x = Math.max(cx - 1, 0); x < Math.min(cx + 2, lineLength); x++) {
                if (/[^\d.]/.test(lines[y][x])) return true;
            }
        }

        return false;
    }

    function gearRatio(cx: number, cy: number): number { // returns the gear ratio if a 3x3 square centered around x,y contains exactly 2 valid numbers, 0 otherwise
        let validNumberIDs = new Set();
        for (let y = Math.max(cy - 1, 0); y < Math.min(cy + 2, lines.length); y++) {
            for (let x = Math.max(cx - 1, 0); x < Math.min(cx + 2, lineLength); x++) {
                const numberID = numberIDGrid[y][x];
                if (numberID !== -1) validNumberIDs.add(numberID);
            }
        }

        if (validNumberIDs.size !== 2) return 0;

        let res = 1;

        validNumberIDs.forEach(val => res *= numberIDToValueMap[val as number]);

        return res;
    }

    function readPartNumber(xStart: number, y: number): {number: number; length: number;} { // read a number whose leftmost digit is at x,y
        const line = lines[y];
        let numStr = "";
        let isAdjacent = false;

        for (let x = xStart; x < lineLength; x++) {
            const char = line[x];
            if (!/[\d]/.test(char)) break; // number is over

            numStr += char;

            if (!isAdjacent) { // perform adjacency test
                if (containsSymbol(x, y)) isAdjacent = true;
            }
        }

        if (isAdjacent) {
            const numVal = parseInt(numStr);

            for (let x = xStart; x < xStart + numStr.length; x++) {
                numberIDGrid[y][x] = numberID;
            }
            
            numberIDToValueMap[numberID] = numVal;
            numberID++;

            return {
                number: numVal,
                length: numStr.length
            }
        } else {
            return {
                number: 0,
                length: numStr.length
            }
        }
    }

    let sum = 0;

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        numberIDGrid[y] = Array(lineLength).fill(-1);
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (/[\d]/.test(char)) { // digit, start consuming
                const readRes = readPartNumber(x, y);
                sum += readRes.number;
                x += readRes.length - 1;
            }
        }
    }

    let gearRatioSum = 0;

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (char === "*") { // gear
                gearRatioSum += gearRatio(x, y);
            }
        }
    }

    console.log(sum);
    console.log(gearRatioSum);
}