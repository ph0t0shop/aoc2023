export async function run(lines: string[]) {
    const times = lines[0].split(" ").filter(item => item.length).slice(1);
    const distances = lines[1].split(" ").filter(item => item.length).slice(1);

    // x = hold time
    // t = total time
    // d = dist
    // r = race time = t - x
    // m = max dist (current)

    // d = r * x = (t - x) * x = tx - x^2
    // dx/dy d = t - 2x
    // d > m?
    // (t - x) * x > m
    // tx - x^2 > m
    // tx - x^2 = m
    // -x^2 + tx - m = 0
    // D = b^2 - 4ac = t^2 - 4 * -1 * -m = t^2 - 4 * m
    // x = (-t - sqrt D) / (2 * -1) V x = (-t + sqrt D) / (2 * -1)

    function calcWins(races: {time: number; distance: number;}[]) {
        let winsProduct = 1;

        for (const race of races) {
            const D = Math.pow(race.time, 2) - 4 * race.distance;
            const x1 = (-race.time - Math.sqrt(D)) / -2;
            const x2 = (-race.time + Math.sqrt(D)) / -2;
            const min = Math.ceil(Math.min(x1, x2) + 0.001);
            const max = Math.floor(Math.max(x1, x2) - 0.001);
            const numWins = max - min + 1;
            winsProduct *= numWins;
        }

        console.log(winsProduct);
    }

    calcWins(times.map((time, index) => ({time: parseInt(time), distance: parseInt(distances[index])})));
    calcWins([{
        time: parseInt(times.join("")),
        distance: parseInt(distances.join(""))
    }]);
}