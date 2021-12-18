type cell = number | [cell, cell];

export default async function main(rawInput: string): Promise<[string|number, string|number]> {
    let input = rawInput.split("\n")
    .map(row => row.length > 0 ? row.trim() : undefined).filter(Boolean) as string[];
    // console.log(input);
    // // console.log(JSON.stringify(input, undefined, 4));

    let part1 = 0;
    let part2 = 0;

    let mainRow: string = input[0];
    for (let [i, row] of input.entries()) {
        if (i === 0) continue;
        // console.log(" ", mainRow);
        // console.log("+", row);
        mainRow = add(mainRow, row);
        // console.log("=", mainRow);
        // console.log();
    }
    part1 = magnitude(JSON.parse(mainRow!));
    for (let [i, row1] of input.entries()) {
        for (let [j, row2] of input.entries()) {
            if (i === j) continue;
            let result = magnitude(JSON.parse(add(row1, row2)));
            if (result > part2) {
                part2 = result;
            }
        }
    }
    return [part1, part2];
}
function add(row1: string, row2: string): string {
    let mainRow = '[' + row1 + "," + row2 + "]";
    // console.log("-", mainRow);
    let splited = false;
    do {
        let exploded = false;
        do {            
            ({row:mainRow, exploded} = explode(mainRow));
            // if (exploded) console.log("X", mainRow);
        }
        while (exploded);
        ({row:mainRow, splited} = split(mainRow));
        // if (splited) console.log("S", mainRow);
    }
    while (splited);
    return mainRow;
}
function explode(fullRow: string): {row: string, exploded: boolean} {
    // console.log("Requsted to explode", fullRow);
    let depth = 0;
    let prevChar = '';
    let prevNumberLength = 0;
    let prevNumberIndex = -1;
    let nextNumberLength = 0;
    let nextNumberIndex = -1;
    let exploding: [number|undefined, number|undefined] = [undefined, undefined];

    let explodingNumbers = [];
    let explodingNumber = '';

    let exploded = false;
    // console.log(fullRow);
    for (let [i,char] of fullRow.split('').entries()) {
        switch(char) {
            case '[':
                if (++depth === 5 && exploding[0] === undefined) {
                    exploding = [i, undefined];
                }
                break;
            case ']':
                if (depth-- === 5 && exploding[1] === undefined) {
                    exploding = [exploding[0], i+1];
                    explodingNumbers.push(Number.parseInt(explodingNumber));
                    explodingNumber = '';
                }
                if (nextNumberIndex !== -1) {
                    exploded = true;
                }
                break;
            case ',':
                if (typeof exploding[1] === "undefined" && typeof exploding[0] === "number") {
                    explodingNumbers.push(Number.parseInt(explodingNumber));
                    explodingNumber = '';
                }
                if (nextNumberIndex !== -1) {
                    exploded = true;
                }
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (typeof exploding[0] === "number") {
                    if (prevNumberLength === 0) {
                        // console.log("Exploding and throwing away left digit");
                    }
                    if (typeof exploding[1] === "number") {
                        if (prevChar.charCodeAt(0) >= '0'.charCodeAt(0) && prevChar.charCodeAt(0) <= '9'.charCodeAt(0)) {
                            nextNumberLength++;
                        } else {
                            nextNumberLength = 1;
                            nextNumberIndex = i;
                        }
                    } else {
                        explodingNumber += char;
                    }
                }
                else if (prevChar.charCodeAt(0) >= '0'.charCodeAt(0) && prevChar.charCodeAt(0) <= '9'.charCodeAt(0)) {
                    prevNumberLength++;
                } else {
                    prevNumberLength = 1;
                    prevNumberIndex = i;
                }
                break;
        }
        if (exploded) break;
        prevChar = char;
    }
    if (exploding[1] !== undefined) {
        exploded = true;
    }
    if (!exploded) {
        return {row: fullRow, exploded};
    }
    // console.log(fullRow.slice(exploding[0], exploding[1]), explodingNumbers);
    let prevNumber = Number.parseInt(fullRow.slice(prevNumberIndex, prevNumberIndex+prevNumberLength));
    let nextNumber = Number.parseInt(fullRow.slice(nextNumberIndex, nextNumberIndex+nextNumberLength));
    // console.log(prevNumber, nextNumber);
    // console.log(fullRow);
    let newRow = "";
    if (prevNumberLength > 0) {
        newRow = fullRow.slice(0, prevNumberIndex)
            + (prevNumber + explodingNumbers[0]).toFixed(0)
            + fullRow.slice(prevNumberIndex + prevNumberLength, exploding[0]);
    } else {
        newRow = fullRow.slice(0, exploding[0]);
    }
    newRow += '0';
    if (nextNumberLength > 0) {
        newRow += fullRow.slice(exploding[1], nextNumberIndex)
            + (nextNumber + explodingNumbers[1]).toFixed(0)
            + fullRow.slice(nextNumberIndex+nextNumberLength);
    } else {
        newRow += fullRow.slice(exploding[1]);
    }
    return {row: newRow, exploded};
}
function split(fullRow: string) : {row: string, splited: boolean} {
    let number = '';
    let numberIndex = -1;
    let numberLength = 0;
    let splited = false;
    for (let [i,char] of fullRow.split('').entries()) {
        switch(char) {
            case ']':
            case ',':
                if (numberLength > 1) {
                    splited = true;
                } else {
                    numberLength = 0;
                }
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                number += char;
                if (numberLength === 0) {
                    numberIndex = i;
                }
                numberLength++;
                break;
        }
        if (splited) break;
    }
    if (!splited) {
        return {row: fullRow, splited};
    }
    let splitNumber = Number.parseInt(fullRow.slice(numberIndex, numberIndex + numberLength))
    let newRow = fullRow.slice(0, numberIndex)
        + '['
        + Math.floor(splitNumber / 2).toFixed(0)
        + ','
        + Math.ceil(splitNumber / 2).toFixed(0)
        + ']'
        + fullRow.slice(numberIndex + numberLength);
    // console.log(splited, numberIndex, numberLength, splitNumber);
    // console.log(fullRow);
    // console.log(newRow);
    return {row: newRow, splited};
}
function magnitude(fullRow: cell): number {
    if (typeof fullRow === "number") {
        return fullRow;
    }
    return 3*magnitude(fullRow[0]) + 2*magnitude(fullRow[1]);
}