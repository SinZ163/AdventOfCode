import * as fs from "fs";

const input = fs.readFileSync("src/day1/input.txt").toString().split("\n").map(row => row.trim()).map(row => Number.parseInt(row));

let part1 = 0;
let part2 = 0;
for (let [i, row] of input.entries()) {
    if (i > 0) {
        if (row > input[i - 1]) {
            part1++;
        }
        if (i > 2) {
            let currentRange = input[i] + input[i - 1] + input[i - 2];
            let prevRange = input[i - 1] + input[i - 2] + input[i - 3];
            if (currentRange > prevRange) {
                part2++;
            }
        }
    }
}

console.log(part1, part2);