export async function run(lines: string[]) {
    let sum = 0;
    let negSum = 0;

    for (const line of lines) {
        let nums = line.split(" ").map(val => parseInt(val));
        // console.log(nums);
        let lastNums = [nums[nums.length - 1]];
        let firstNums = [nums[0]];

        if (nums.length < 2) throw new Error("Nums array too short");
        while (nums.some(num => num !== nums[0])) {
            const newNums = [];
            for (let i = 1; i < nums.length; i++) {
                newNums.push(nums[i] - nums[i - 1]);
            }
            nums = newNums;
            lastNums.push(newNums[nums.length - 1]);
            firstNums.push(newNums[0]);
            // console.log(nums);
        }

        // console.log(lastNums);

        // console.log(lastNums.reduce((a, b) => a + b));
        
        sum += lastNums.reduce((a, b) => a + b);
        negSum += firstNums.reduceRight((a, b) => b - a);
    }
    console.log(sum);
    console.log(negSum);
}