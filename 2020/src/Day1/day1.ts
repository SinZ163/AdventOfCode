import * as fs from "fs";

const input = fs.readFileSync("src/day1/input.txt").toString().split("\n");
let part1Solution = -1;
let part2Solution = -1;
for (let i = 0; i < input.length; i++) {
    for (let j = i+1; j < input.length; j++) {
        if (part1Solution === -1) {
            if (Number.parseInt(input[i]) + Number.parseInt(input[j]) === 2020) {
                part1Solution = Number.parseInt(input[i]) * Number.parseInt(input[j]);
            }
        }
        if (part2Solution === -1) {
            for (let k = j + 1; k < input.length; k++) {
                if (Number.parseInt(input[i]) + Number.parseInt(input[j]) + Number.parseInt(input[k]) === 2020) {
                    part2Solution = Number.parseInt(input[i]) * Number.parseInt(input[j]) * Number.parseInt(input[k]);
                    break;
                }
            }
        }
        if (part1Solution > -1 && part2Solution > -1) {
            break;
        }
    }
    if (part1Solution > -1 && part2Solution > -1) {
        break;
    }
}

console.log(`Part 1 solution: ${part1Solution}`);
console.log(`Part 2 solution: ${part2Solution}`);