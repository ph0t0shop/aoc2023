type CubeColor = "red"|"green"|"blue";
type BagContents = Record<CubeColor, number>;

export async function run(lines: string[]) {
    const contents0: BagContents = {
        red: 12,
        green: 13,
        blue: 14
    }

    let sumPossible = 0;
    let powerSum = 0;

    for (const line of lines) {
        if (line.length === 0) continue;

        const minContents: BagContents = {
            red: 0,
            green: 0,
            blue: 0
        }
        const [gameNumStr, gameDataStr] = line.split(": ");
        const gameNum = parseInt(gameNumStr.substring(5));

        const grabStrs = gameDataStr.split("; ");

        let possible = true;

        for (const grabStr of grabStrs) {
            for (const singleGrabStr of grabStr.split(", ")) {
                const [grabNumStr, grabColor] = singleGrabStr.split(" ") as [string, CubeColor];

                const grabNum = parseInt(grabNumStr);

                if (grabNum > contents0[grabColor]) {
                    possible = false;
                }

                minContents[grabColor] = Math.max(minContents[grabColor], grabNum);
            }
        }

        if (possible) sumPossible += gameNum;
        powerSum += minContents["red"] * minContents["green"] * minContents["blue"];
    }

    console.log(sumPossible);
    console.log(powerSum);
}