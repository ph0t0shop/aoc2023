import { readFile } from "fs/promises";

const fileLines = (await readFile("inputs/input1.txt")).toString().split("\n");

console.log(fileLines.map(line => line.length ? Number(line.match(/^[^\d]*(\d)/)![1] + line.match(/(\d)[^\d]*$/)![1]) : 0).reduce((a,b) => a+b));

const digitWords: Record<string, string> = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9"
};

console.log(fileLines.map(line => {
    if (!line.length) return 0;
    const matches = Array.from(line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g), x => x[1]); // https://stackoverflow.com/questions/20833295/how-can-i-match-overlapping-strings-with-regex

    const firstMatch = matches[0];
    const lastMatch = matches[matches.length - 1];

    const firstMatchDigit = firstMatch.length === 1 ? firstMatch : digitWords[firstMatch];
    const lastMatchDigit = lastMatch.length === 1 ? lastMatch : digitWords[lastMatch];

    return Number(firstMatchDigit + lastMatchDigit);
}).reduce((a,b) => a + b));