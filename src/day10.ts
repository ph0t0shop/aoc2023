import { writeFile } from "fs/promises";
import { Coordinate, HashSet } from "./util.js";

export async function run(lines: string[]) {
    const y = lines.findIndex(line => line.includes("S"));
    const x = lines[y].indexOf("S");
    const startCoord = new Coordinate(x, y);
    
    const connections: Record<string, Coordinate[]> = {
        "|": [new Coordinate(0, -1), new Coordinate(0,1)],
        "-": [new Coordinate(-1, 0), new Coordinate(1,0)],
        "L": [new Coordinate(0, -1), new Coordinate(1, 0)],
        "J": [new Coordinate(0, -1), new Coordinate(-1, 0)],
        "7": [new Coordinate(-1, 0), new Coordinate(0, 1)],
        "F": [new Coordinate(1, 0), new Coordinate(0, 1)],
        ".": []
    }

    const sides: Record<string, [Coordinate[], Coordinate[]]> = { // left, right. entry as seen in connections
        "|": [[new Coordinate(1, -1), new Coordinate(1, 0), new Coordinate(1, 1)], [new Coordinate(-1, -1), new Coordinate(-1, 0), new Coordinate(-1, 1)]],
        "-": [[new Coordinate(-1, -1), new Coordinate(0, -1), new Coordinate(1, -1)], [new Coordinate(-1, 1), new Coordinate(0, 1), new Coordinate(1, 1)]],
        "L": [[new Coordinate(1, -1)], [new Coordinate(-1, -1), new Coordinate(-1, 0), new Coordinate(-1, 1), new Coordinate(0, 1), new Coordinate(1, 1)]],
        "J": [[new Coordinate(1, -1), new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(0, 1), new Coordinate(-1, 1)], [new Coordinate(-1, -1)]],
        "7": [[new Coordinate(-1, -1), new Coordinate(0, -1), new Coordinate(1, -1), new Coordinate(1, 0), new Coordinate(1, 1)], [new Coordinate(-1, 1)]],
        "F": [[new Coordinate(1, 1)], [new Coordinate(1, -1), new Coordinate(0, -1), new Coordinate(-1, -1), new Coordinate(-1, 0), new Coordinate(-1, 1)]],
    }

    let prev: Coordinate = new Coordinate(x, y);
    let curr: Coordinate = prev;
    let entry0 = false;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const currX = x + dx;
            const currY = y + dy;
            const char = lines[currY][currX];
            
            const connection = connections[char];

            if (connection.length === 0) continue;

            if (connection[0].x === -dx && connection[0].y === -dy) {
                curr = new Coordinate(currX, currY);
                entry0 = true;
            } else if (connection[1].x === -dx && connection[1].y === -dy) {
                curr = new Coordinate(currX, currY);
            }

        }
    }

    const path: {coord: Coordinate, entry0: boolean}[] = [{coord: prev, entry0: true}, {coord: curr, entry0}];

    while (!curr.equals(startCoord)) {
        const char = lines[curr.y][curr.x];

        const connection = connections[char];

        const newCoord1: Coordinate = curr.plus(connection[0]);
        const newCoord2: Coordinate = curr.plus(connection[1]);

        if (newCoord1.equals(prev)) { // pick coord 2
            prev = curr;
            curr = newCoord2;
        } else if (newCoord2.equals(prev)){
            prev = curr;
            curr = newCoord1;
        }

        const newChar = lines[curr.y][curr.x];

        let entry0 = false;

        if (newChar !== "S") {
            entry0 = curr.plus(connections[lines[curr.y][curr.x]][0]).equals(prev);
        }

        path.push({coord: curr, entry0});
    }

    const pathSet = new HashSet<Coordinate>(path.map(piece => piece.coord));
    const leftSet = new HashSet<Coordinate>();
    const rightSet = new HashSet<Coordinate>();

    for (const piece of path) {
        const char = lines[piece.coord.y][piece.coord.x];
        if (char === "S") continue;

        const [side1, side2] = sides[char];

        for (const delta of side1) {
            const coord: Coordinate = piece.coord.plus(delta);

            if (!pathSet.has(coord)) {
                (piece.entry0 ? leftSet : rightSet).add(coord);
            }
        }

        for (const delta of side2) {
            const coord: Coordinate = piece.coord.plus(delta);

            if (!pathSet.has(coord)) {
                (piece.entry0 ? rightSet : leftSet).add(coord);
            }
        }
    }

    let str: string[][] = lines.map(line => line.split("").map(item => "."));

    for (const piece of path) {
        str[piece.coord.y][piece.coord.x] = lines[piece.coord.y][piece.coord.x];
    }

    const resStr = str.map(line => line.join("")).join("\n");

    await writeFile("out.txt", resStr);

    let prevCount = 0;
    let currCount = leftSet.size;
    let orientation = 0; // 0 = undefined; 1 = left outside, right inside; 2 = right outside, left inside

    while (prevCount !== currCount) {
        for (const coord of leftSet) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const x = coord.x + dx;
                    const y = coord.y + dy;
                    if (x < 0 || x >= lines[0].length) { // X out of bounds
                        break;
                    }
                    if (y < 0 || y >= lines.length) { // Y out of bounds
                        continue;
                    }

                    const newCoord = new Coordinate(x, y);
                    if (!pathSet.has(newCoord)) { // valid point to add
                        leftSet.add(newCoord);

                        if (orientation === 0 && (x === 0 || x === lines[0].length - 1 || y === 0 || y === lines.length - 1)) { // this is an outer point
                            orientation = 1;
                        }
                    }
                }
            }
        }
        prevCount = currCount;
        currCount = leftSet.size;
    }
    
    prevCount = 0;
    currCount = rightSet.size;

    while (prevCount !== currCount) {
        for (const coord of rightSet) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const x = coord.x + dx;
                    const y = coord.y + dy;
                    if (x < 0 || x >= lines[0].length) { // X out of bounds
                        break;
                    }
                    if (y < 0 || y >= lines.length) { // Y out of bounds
                        continue;
                    }

                    const newCoord = new Coordinate(x, y);
                    if (!pathSet.has(newCoord)) { // valid point to add
                        rightSet.add(newCoord);

                        if (orientation === 0 && (x === 0 || x === lines[0].length - 1 || y === 0 || y === lines.length - 1)) { // this is an outer point
                            orientation = 2;
                        }
                    }
                }
            }
        }
        prevCount = currCount;
        currCount = rightSet.size;
    }

    console.log(Math.floor(path.length / 2));

    if (orientation === 0) throw new Error("Orientation undefined");
    console.log((orientation === 1 ? rightSet : leftSet).size);
}