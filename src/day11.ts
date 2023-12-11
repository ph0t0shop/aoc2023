import { Coordinate, transpose } from "./util.js";

export async function run(lines: string[]) {
    let expandRows: Record<number, boolean> = {};
    let expandCols: Record<number, boolean> = {};

    for (const lineIndex in lines) {
        if (!lines[lineIndex].includes("#")) {
            expandRows[lineIndex] = true;
        }
    }

    let galaxies: Coordinate[] = [];

    for (let x = 0; x < lines[0].length; x++) {
        let containsGalaxy = false;
        for (let y = 0; y < lines.length; y++) {
            if (lines[y][x] === "#") {
                galaxies.push(new Coordinate(x, y));
                containsGalaxy = true;
            }
        }
        if (!containsGalaxy) expandCols[x] = true;
    }

    let totalDist1 = 0;
    let totalDist2 = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const galaxy1 = galaxies[i];
            const galaxy2 = galaxies[j];

            let expansionAmount = 0;

            for (let x = Math.min(galaxy1.x, galaxy2.x); x < Math.max(galaxy1.x, galaxy2.x); x++) {
                if (expandCols[x]) expansionAmount++;
            }

            for (let y = Math.min(galaxy1.y, galaxy2.y); y < Math.max(galaxy1.y, galaxy2.y); y++) {
                if (expandRows[y]) expansionAmount++;
            }

            let manhattanDist = galaxy1.manhattanDistanceTo(galaxy2);
            totalDist1 += manhattanDist + expansionAmount;
            totalDist2 += manhattanDist + 999999 * expansionAmount;
        }
    }

    console.log(totalDist1);
    console.log(totalDist2);
}