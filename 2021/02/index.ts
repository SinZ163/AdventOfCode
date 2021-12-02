import * as fs from "fs";

const input = fs.readFileSync("02/input.txt").toString().split("\n")
    .map(row => row.trim()).map(row => row.match(/(\w+) (\d+)/)).filter(Boolean);

let part1 = 0;
let part2 = 0;

let x = 0;
let aim = 0;
let depth = 0;

for (let row of input) {
    switch(row[1]) {
        case "forward":
            depth += aim * Number.parseInt(row[2]);
            x += Number.parseInt(row[2]);
            break;
        case "down":
            aim += Number.parseInt(row[2]);
            break;
        case "up":
            aim -= Number.parseInt(row[2]);
            break;
    }
}
part1 = x * aim;
part2 = x * depth;

console.log(part1, part2);