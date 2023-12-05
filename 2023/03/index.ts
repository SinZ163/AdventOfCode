//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let width = input[0].length;
    let height = input.length;

    let part1 = 0;
    let part2 = 0;

    let y = 0;
    let gears: number[][][] = new Array(height);
    for (let y = 0; y < height; y++) {
        gears[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            gears[y][x] = [];
        }
    }
    for (let row of input) {
        let currentNumber = undefined;
        let symbolFound = false;
        let foundGears: [number, number][] = [];
        for (let x = 0; x < width; x++) {
            function checkSymbol(x: number, y: number/*, log: string*/) {
                const char = input[y].charCodeAt(x);
                if (char >= 48 && char < 58) return false;
                if (char == 46) return false; // period/dot
                if (Number.isNaN(char)) return false;
                symbolFound = true;
                if (char == 42) { // star
                    foundGears.push([x,y]);
                }
            }
            const char = row.charCodeAt(x);
            if (char >= 48 && char < 59) {
                let val = char - 48;
                if (!currentNumber) {
                    currentNumber = val;
                    if (x > 0) {
                        checkSymbol(x - 1, y/*, "left"*/);
                        if (y > 0) {
                            checkSymbol(x - 1, y - 1/*, "top left"*/);
                        }
                        if (y < (height - 1)) {
                            checkSymbol(x - 1, y + 1/*, "bottom left"*/);
                        }
                    }
                } else {
                    currentNumber *= 10;
                    currentNumber += val;
                }
                if (y > 0) {
                    checkSymbol(x, y - 1/*, "above"*/);
                }                
                if (y < (height - 1)) {
                    checkSymbol(x, y + 1/*, "below"*/);
                }
            } else if (currentNumber) {
                // Number ended
                checkSymbol(x, y/*, "right"*/);
                if (y > 0) {
                    checkSymbol(x, y - 1/*, "top right"*/);
                }                
                if (y < (height - 1)) {
                    checkSymbol(x, y + 1/*, "bottom right"*/);
                }
                if (symbolFound) {
                    part1 += currentNumber;
                    //console.log(`Found ${currentNumber} (${JSON.stringify(startCoords)}, ${JSON.stringify(endCoords)})`);
                    for (let gear of foundGears) {
                        gears[gear[1]][gear[0]].push(currentNumber);
                    }
                }/* else {
                    console.log(`Found ${currentNumber} (${JSON.stringify(startCoords)}, ${JSON.stringify(endCoords)})` + " without symbol");
                }*/
                symbolFound = false;
                currentNumber = undefined;
                foundGears = [];
            }
        }
        // edge case, number ended at the wall
        if (currentNumber) {
            if (symbolFound) {
                part1 += currentNumber;
                //console.log(`Found ${currentNumber} (${JSON.stringify(startCoords)}, ${JSON.stringify(endCoords)}) at the wall`);
                for (let gear of foundGears) {
                    gears[gear[1]][gear[0]].push(currentNumber);
                }
            }/* else {
                console.log(`Found ${currentNumber} (${JSON.stringify(startCoords)}, ${JSON.stringify(endCoords)}) at the wall` + " without symbol");
            }*/
        }
        y++;
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (gears[y][x].length === 2) {
                part2 += gears[y][x][0] * gears[y][x][1];
            }
        }
    }

    return [part1, part2];
}