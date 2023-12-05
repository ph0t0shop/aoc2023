type ItemMap = {
    destStart: number;
    sourceStart: number;
    rangeLength: number;
}[];

const maps: ItemMap[] = [];

export async function run(lines: string[]) {
    let mapIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!/\d/.test(line[0])) {
            mapIndex++;
            maps[mapIndex] = [];
            continue;
        }

        const [destStart, sourceStart, rangeLength] = line.split(" ").map(str => parseInt(str));

        maps[mapIndex].push({destStart, sourceStart, rangeLength});
    }

    for (const nMaps of maps) { // sort all maps by sourceStart
        nMaps.sort((map1, map2) => map1.sourceStart - map2.sourceStart);
    }

    function cloneArray2(arr: [number, number][]) {
        return arr.map(item => [...item]);
    }

    function inRange(num: number, start: number, end: number) {
        return num >= start && num < end;
    }

    function findLowestLocation(seeds: [number, number][]) {
        let currRanges = cloneArray2(seeds);

        for (let i = 0; i < maps.length; i++) {
            const currMaps = maps[i];

            const newRanges: [number, number][] = [];
            
            for (const currRange of currRanges) {
                let [currRangeStart, currRangeEnd] = currRange;

                if (currRangeEnd <= currRangeStart) {
                    continue;
                }

                for (const map of currMaps) {
                    const delta = map.destStart - map.sourceStart;
                    if (inRange(currRangeStart, map.sourceStart, map.sourceStart + map.rangeLength)) { // start is within, end may be
                        const mappingEnd = Math.min(currRangeEnd, map.sourceStart + map.rangeLength);
                        newRanges.push([currRangeStart + delta, mappingEnd + delta]);
                        currRangeStart = mappingEnd;
                    } else if (inRange(currRangeEnd - 1, map.sourceStart, map.sourceStart + map.rangeLength)) { // end is within but start is not
                        newRanges.push([currRangeStart, map.sourceStart]);
                        newRanges.push([map.sourceStart + delta, currRangeEnd + delta]);
                        currRangeStart = currRangeEnd; // done
                    } else if (inRange(map.sourceStart, currRangeStart, currRangeEnd) && inRange(map.sourceStart + map.rangeLength, currRangeStart, currRangeEnd)) {
                        newRanges.push([currRangeStart, map.sourceStart]);
                        newRanges.push([map.sourceStart + delta, map.sourceStart + map.rangeLength + delta]);
                        currRangeStart = map.sourceStart + map.rangeLength;
                    }

                    // if (currNum >= map.sourceStart && currNum < map.sourceStart + map.rangeLength) {
                    //     currNum += map.destStart - map.sourceStart;
                    //     break;
                    // }
                }

                if (currRangeEnd > currRangeStart) { // remaining unmapped part stays the same
                    newRanges.push([currRangeStart, currRangeEnd]);
                }
            }

            currRanges = newRanges;
        }

        console.log(Math.min(...currRanges.map(range => range[0])));
    }

    findLowestLocation(lines[0].substring(7).split(" ").map(str => [parseInt(str), parseInt(str) + 1]));
    
    const seedRangesStr = lines[0].substring(7).split(" ");
    const seedRanges: [number, number][] = [];

    for (let i = 0; i < seedRangesStr.length; i+= 2) {
        seedRanges.push([parseInt(seedRangesStr[i]), parseInt(seedRangesStr[i]) + parseInt(seedRangesStr[i + 1])])
    }

    findLowestLocation(seedRanges);
}

