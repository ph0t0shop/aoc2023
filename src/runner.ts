import { readFile } from "fs/promises";
import { exists } from "./util.js";

let dayNum: number | string = process.argv[2];

if (!dayNum) {
    console.error("Please pass a day argument like this: 'npm run exec -- 3' or use 'today' for today's puzzle.");
    process.exit(1);
}

if (dayNum === "today") {
    dayNum = (new Date()).getDate();
}

const inputPath = `inputs/input${dayNum}.txt`;

if (!await exists(inputPath)) {
    console.log("Input file doesn't exist, exiting...");
    process.exit(2);
}

const inputLines = (await readFile(inputPath)).toString().split("\n").filter(line => line.length > 0);

const codeFile = await import(`./day${dayNum}.js`);

await codeFile.run(inputLines);