import * as fs from "fs";

const input = fs.readFileSync("01/input.txt").toString().split("\n")
    .map(row => row.trim()).map(row => Number.parseInt(row));

let part1 = 0;
let part2 = 0;



console.log(part1, part2);