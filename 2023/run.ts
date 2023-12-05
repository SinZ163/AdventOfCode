import { time } from "console";
import * as fs from "fs";
import { argv } from "process";

async function main() {

    let runCount = Number.parseInt(argv[3]) || 1;
    console.log(argv[2], runCount);
    let inputType = "input";
    if (argv[3] === "test") {
        inputType = "test";
    }
    if (argv[4] && argv[4].length > 0) {
        inputType = argv[4];
    }
    
    let preInput = process.hrtime.bigint();
    let input = fs.readFileSync(`${argv[2]}/${inputType}.txt`).toString();
    input = input.replaceAll("\r", "");
    input = input.trimEnd();
    let postInput = process.hrtime.bigint();
    
    let preRequire = process.hrtime.bigint();
    let {default:day} = require(`./${argv[2]}/index.ts`);
    let postRequire = process.hrtime.bigint();
    
    let times: number[] = [];
    for (let i = 0; i < runCount; i++) {
        let preRun = process.hrtime.bigint();
        let output = day(input, i);
        if (typeof output === "object" && output.then) {
            output = await output;
        }
        let postRun = process.hrtime.bigint();
        if (i === 0) {
            if (inputType !== "input") {
                console.warn(`RUNNING IN ${inputType.toUpperCase()} MODE DO NOT SUBMIT`)
            }
            console.table({
                part1: output[0],
                part2: output[1]
            })
        }
        times.push(Number(postRun - preRun));
    }
    console.table({
        first: times[0] / 1e6,
        min: Math.min(...times) / 1e6,
        max: Math.max(...times) / 1e6,
        avg: times.reduce((prev, current) => prev+current, 0 ) / runCount / 1e6,
        inputProcessing: Number(postInput - preInput) / 1e6,
        jsParse: Number(postRequire - preRequire) / 1e6,
        runCount,
        inputType,
    });
}
main();
