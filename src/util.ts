import { access, constants } from "fs/promises";

export async function exists(filePath: string) {
    try {
        await access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

interface Hashable {
    toHashCode(): number;
}

export class Coordinate implements Hashable {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toHashCode(): number {
        return (this.x + 10_000_000) << 24 | (this.y + 10_000_000);
    }

    plus(coord: Coordinate): Coordinate
    plus(x: number, y: number): Coordinate;
    plus(coord: Coordinate | number, y?: number): Coordinate {
        if (y !== undefined) {
            return new Coordinate(this.x + (coord as number), this.y + y);
        } else {
            return new Coordinate(this.x + (coord as Coordinate).x, this.y + (coord as Coordinate).y);
        }
    }

    manhattanDistanceTo(coord: Coordinate): number {
        return Math.abs(this.x - coord.x) + Math.abs(this.y - coord.y);
    }

    clone(): Coordinate {
        return new Coordinate(this.x, this.y);
    }

    equals(coord: Coordinate): boolean {
        return this.x === coord.x && this.y === coord.y;
    }
}

export class HashSet<T extends Hashable> {
    private set: Record<number, T> = {};

    constructor(iterable?: Iterable<T> | null) {
        if (iterable) {
            for (const item of iterable) {
                this.set[item.toHashCode()] = item;
            }
        }
        
        const testSet = new Set<T>();
    }

    add(item: T) {
        this.set[item.toHashCode()] = item;
    }

    has(item: T): boolean {
        return item.toHashCode() in this.set;
    }

    get size(): number {
        return Object.keys(this.set).length;
    }

    [Symbol.iterator]() {
        return Object.values(this.set).values();
    }
}

export function transpose(lines: string[]): string[] {
    const flippedLines: string[] = [];
    for (let x = 0; x < lines[0].length; x++) {
        flippedLines.push("");
        for (let y = 0; y < lines.length; y++) {
            flippedLines[x] += lines[y][x];
        }
    }
    return flippedLines;
}