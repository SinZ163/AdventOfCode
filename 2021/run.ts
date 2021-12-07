import * as fs from "fs";
import { argv } from "process";


let runCount = Number.parseInt(argv[3]) || 1;
console.log(argv[2], runCount);

let preInput = process.hrtime.bigint();
const input = fs.readFileSync(`${argv[2]}/input.txt`).toString();
let postInput = process.hrtime.bigint();

let preRequire = process.hrtime.bigint();
let {default:day} = require(`./${argv[2]}/index.ts`);
let postRequire = process.hrtime.bigint();

let times: number[] = [];
let preAvg = process.hrtime.bigint();
for (let i = 0; i < runCount; i++) {
    let preRun = process.hrtime.bigint();
    let output = day(input);
    let postRun = process.hrtime.bigint();
    if (i === 0) {
        console.table({
            part1: output[0],
            part2: output[1]
        })
    }
    times.push(Number(postRun - preRun));
}
let postAvg = process.hrtime.bigint();
console.table({
    min: Math.min(...times) / 1e6,
    max: Math.max(...times) / 1e6,
    avg: Number(postAvg - preAvg) / 1e6 / runCount,
    inputProcessing: Number(postInput - preInput) / 1e6,
    jsParse: Number(postRequire - preRequire) / 1e6,
    runCount,
});