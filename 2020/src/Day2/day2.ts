import * as fs from "fs";

const input = fs.readFileSync("src/day2/input.txt").toString().split("\n");

let validPasswords1 = [];
let validPasswords2 = [];

for (let line of input) {
    const parsedLine = line.match(/(\d+)-(\d+) (\w): (\w+)/);
    const min = Number.parseInt(parsedLine[1]);
    const max = Number.parseInt(parsedLine[2]);
    const char = parsedLine[3];
    const password = parsedLine[4];

    const count = password.match(RegExp(char, "g"))?.length || 0;

    if (count >= min && count <= max) {
        validPasswords1.push(password);
    }
    var lowerCheck = password[min - 1] === char;
    var upperCheck = password[max - 1] === char;
    if (lowerCheck ? !upperCheck : upperCheck) {
        validPasswords2.push(password);
    }
}
console.log(`Part 1 Solution: ${validPasswords1.length}`);
console.log(`Part 2 Solution: ${validPasswords2.length}`);