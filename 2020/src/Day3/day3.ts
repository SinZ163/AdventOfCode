import * as fs from "fs"

const input = fs.readFileSync("src/day3/input.txt").toString().split("\n").map(str => str.trim());

let count1 = 0;
let count3 = 0;
let count5 = 0;
let count7 = 0;
let count2 = 0;

let x1 = 0;
let x2 = 0;
let x3 = 0;
let x5 = 0;
let x7 = 0;
for (let y = 0; y < input.length; y++) {
    const char1 = input[y][x1 % input[y].length];
    if (char1 === "#") {
        count1++;
    }
    const char3 = input[y][x3 % input[y].length];
    if (char3 === "#") {
        count3++;
    }
    const char5 = input[y][x5 % input[y].length];
    if (char5 === "#") {
        count5++;
    }
    const char7 = input[y][x7 % input[y].length];
    if (char7 === "#") {
        count7++;
    }

    if (y % 2 == 0) {
        const char2 = input[y][x2 % input[y].length];
        if (char2 === "#") {
            count2++;
        }
        x2 += 1;
    }
        
    x1 += 1;
    x3 += 3;
    x5 += 5;
    x7 += 7;
}

console.log("Part 1 solution: " + count3);
console.table({count1,count2,count3,count5,count7});
console.log("Part 2 solution: " + (count1 * count2 * count3 * count5 * count7));