import "dotenv/config";
import { writeFile } from "fs/promises";
import { exists } from "./util.js";

let dayNum: number | string = process.argv[2];

if (!dayNum) {
    console.error("Please pass a day argument like this: 'npm run setup -- 3' or use 'today' for today's puzzle.");
    process.exit(1);
}

const urlPrefix = "https://adventofcode.com/2023/day/";

if (dayNum === "today") {
    dayNum = (new Date()).getDate();
}

const inputPath = `inputs/input${dayNum}.txt`;
const outputPath = `src/day${dayNum}.ts`;

if (await exists(outputPath)) {
    console.error("Output file already exists, exiting...");
    process.exit(2);
}

await writeFile(outputPath,
`export async function run(lines: string[]) {
    // code here
}`);

if (await exists(inputPath)) {
    console.log("Input file already exists, skipping download...");
} else {
    const puzzleInput = await fetch(`${urlPrefix}${dayNum}/input`, {
        headers: {
            "Cookie": `session=${process.env.SESSION_COOKIE}`
        }
    });

    await writeFile(inputPath, await puzzleInput.text());
}

console.log(`Success, visit ${urlPrefix}${dayNum} to read the challenge.`);