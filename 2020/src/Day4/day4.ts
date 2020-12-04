import * as fs from "fs"

const input = fs.readFileSync("src/day4/input.txt").toString().split("\r\n\r\n");

let part1: Passport[] = [];
let part2: Passport[] = [];

interface Passport {
    ecl: string;
    pid: string;
    eyr: string;
    hcl: string;
    byr: string;
    iyr: string;
    cid?: string;
    hgt: string;
}

function isDigitAndBetween(input: string, min: number, max: number) {
    let digit = Number.parseInt(input);
    return !(!digit || digit < min || digit > max);
}

let i = 5;
for (let line of input) {
    let passport = Object.fromEntries(line.match(/([^:]+)\:([^\s]+)\s?/g)?.map(val => val.trim().split(":")) || []) as Passport;
    // console.log(passport);
    if (passport.ecl === undefined) {
        continue;
    }
    if (passport.pid === undefined) {
        continue;
    }
    if (passport.eyr === undefined) {
        continue;
    }
    if (passport.hcl === undefined) {
        continue;
    }
    if (passport.byr === undefined) {
        continue;
    }
    if (passport.iyr === undefined) {
        continue;
    }
    if (passport.hgt === undefined) {
        continue;
    }
    part1.push(passport);

    if (!isDigitAndBetween(passport.byr, 1920, 2002)) {
        continue;
    }
    if (!isDigitAndBetween(passport.iyr, 2010, 2020)) {
        continue;
    }
    if (!isDigitAndBetween(passport.eyr, 2020, 2030)) {
        continue;
    }
    let hgt = passport.hgt.match(/^(\d+)(cm|in)$/);
    if (!hgt) {
        continue;
    };
    let height = Number.parseInt(hgt[1]);
    if (hgt[2] === "cm" && (height < 150 || height > 193)) {
        continue;
    }
    if (hgt[2] === "in" && (height < 59 || height > 76)) {
        continue;
    }

    if (passport.hcl.match(/\#[0-9a-f]{6}/)?.length !== 1) {
        continue;
    }

    if (!["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(passport.ecl)) {
        continue;
    }
    
    if (passport.pid.match(/^\d{9}$/)?.length !== 1) {
        continue;
    }

    part2.push(passport);
}

console.log(`Part 1 solution: ${part1.length}`);
console.log(`Part 2 solution: ${part2.length}`);