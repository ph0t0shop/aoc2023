export async function run(lines: string[]) {
    const steps = lines[0];
    const nodes: Record<string, [string, string]> = {};

    function findLCM(nums: number[]) {
        const pfs: Record<number, number>[] = [];
        for (let i = 0; i < nums.length; i++) {
            const num = nums[i];
            const pfm: Record<number, number> = {};
            const pfn = primeFactorization(num);
            for (const pf of pfn) {
                if (!(pf in pfm)) pfm[pf] = 0;
                pfm[pf]++;
            }
            pfs[i] = pfm;
        }

        let lcm = 1;

        for (let i = 0; i < nums.length; i++) {
            const pfm = pfs[i];
            for (const pf of Object.keys(pfm)) {
                for (let j = 0; j < pfm[pf as any]; j++) {
                    lcm *= pf as any;
                    for (let j = i + 1; j < nums.length; j++) {
                        const pfm2 = pfs[j];
                        if (pf in pfm2) {
                            pfm2[pf as any]--;
                        }
                    }
                }
                pfm[pf as any] = 0;
            }
        }

        return lcm;
    }

    function primeFactorization(num: number) {
        return primeFactorizationStep(num).sort((a, b) => a - b);
    }

    function primeFactorizationStep(num: number): number[] {
        for (let i = 2; i < Math.ceil(Math.sqrt(num)); i++) {
            if (num % i === 0) {
                return [i, ...primeFactorizationStep(num / i)]
            }
        }

        return [num];
    }

    for (let i = 1; i < lines.length; i++) {
        const [node, destsStr] = lines[i].split(" = ");
        const [dest1, dest2] = destsStr.substring(1, destsStr.length - 1).split(", ");
        nodes[node] = [dest1, dest2];
    }

    let currNode = "AAA";
    let nSteps = 0;

    while (currNode !== "ZZZ") {
        for (const step of steps) {
            currNode = nodes[currNode][step === "L" ? 0 : 1];
            nSteps++;
        }
        if (currNode === "ZZZ") break;
    }

    console.log(nSteps);

    let currNodes: string[] = Object.keys(nodes).filter(val => val.endsWith("A"));
    let loopSize: Record<number, number> = {};

    nSteps = 0;

    while(Object.keys(loopSize).length !== currNodes.length) {
        for (const step of steps) {
            const newNodes = [];
            for (let i = 0; i < currNodes.length; i++) {
                const node = currNodes[i];
                const newNode = nodes[node][step === "L" ? 0 : 1];

                if (newNode.endsWith("Z") && !(i in loopSize)) {
                    loopSize[i] = nSteps + 1;
                }

                newNodes.push(newNode);
            }
            currNodes = newNodes;
            nSteps++;
        }
    }

    let vals = Object.values(loopSize);

    console.log(findLCM(vals));
    
}