import * as fs from "fs";

const input = fs.readFileSync("03/input.txt").toString().split("\n")
    .map(row => row.trim());

let part1 = 0;
let part2 = 0;

let gamma = "";
let epsilon = "";
let oxygen = input;
let co2 = input;

let oxygenPrefix = "";
let co2Prefix = "";
for (let i of Array.from({length: input[0].length}).keys()) {
    let mainOccurances = {'0': 0, '1': 0}
    for (let row of input) {
        mainOccurances[row[i]]++;
    }
    gamma = gamma + (mainOccurances['0'] > mainOccurances['1'] ? '0' : '1');
    epsilon = epsilon + (mainOccurances['0'] < mainOccurances['1'] ? '0' : '1');

    
    if (oxygen.length > 1) {
        let oxygenOccurances = {'0': 0, '1': 0}
        for (let row of oxygen) {
            oxygenOccurances[row[i]]++;
        }
        oxygenPrefix = oxygenPrefix + (oxygenOccurances['0'] > oxygenOccurances['1'] ? '0' : '1');
        oxygen = oxygen.filter(row => row.startsWith(oxygenPrefix));
    }
    if (co2.length > 1) {
        let co2Occurances = {'0': 0, '1': 0}
        for (let row of co2) {
            co2Occurances[row[i]]++;
        }
        co2Prefix = co2Prefix + (co2Occurances['1'] < co2Occurances['0'] ? '1' : '0');
        co2 = co2.filter(row => row.startsWith(co2Prefix));
    }
}

part1 = Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2);
part2 = Number.parseInt(oxygen[0], 2) * Number.parseInt(co2[0], 2);
console.log(part1, part2);