export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim().split('').map(cell => Number.parseInt(cell)));

    let part1 = 0;
    let part2 = 0;
    let basins: Array<[number, number]>[] = [];
    for (let y = 0; y < input.length; y++) {
        let prevBasinHoriz: number|null = null;
        for (let x = 0; x < input[y].length; x++) {
            let currentCell = input[y][x];
            let isSmaller = true;
            if (x > 0) {
                if (input[y][x-1] <= currentCell) isSmaller = false;
            }
            if (y > 0) {
                if (input[y-1][x] <= currentCell) isSmaller = false;
            }
            if (x < input[y].length - 1) {
                if (input[y][x+1] <= currentCell) isSmaller = false;
            }
            if (y < input.length - 1) {
                if (input[y+1][x] <= currentCell) isSmaller = false;
            }
            if (isSmaller) {
                part1 += currentCell + 1;
            }
            if (currentCell < 9) {
                let foundBasin = false;
                // console.log(x,y,prevBasinHoriz);
                if (y > 0) {
                    for (let [basinID, basin] of basins.entries()) {
                        if (basin.findIndex(cell => cell[0] === x && cell[1] === y-1) !== -1) {
                            basins[basinID].push([x, y]);
                            if (prevBasinHoriz !== null && prevBasinHoriz != basinID) {
                                // console.log("merging prevBasin", prevBasinHoriz, basins[prevBasinHoriz]);
                                basins[basinID].push(...basins[prevBasinHoriz]);
                                basins.splice(prevBasinHoriz, 1);
                                if (prevBasinHoriz < basinID) {
                                    basinID--;
                                }
                            } else {
                                // console.log("Joining existing basin by vertical lookup", x, y, currentCell, prevBasinHoriz);
                            }
                            prevBasinHoriz = basinID;
                            foundBasin = true;
                            break;
                        }
                    }
                }
                if (!foundBasin && prevBasinHoriz !== null) {
                    // console.log("Joining existing basin by horizontal cache", x, y, currentCell, prevBasinHoriz);
                    basins[prevBasinHoriz].push([x, y]);
                    foundBasin = true;
                }
                if (!foundBasin) {
                    basins.push([[x,y]]);
                    prevBasinHoriz = basins.length - 1;
                    // console.log("Creating new basin", x, y, currentCell, prevBasinHoriz);
                }
            } else {
                prevBasinHoriz = null;
            }
        }
    }
    // console.log(basins);
    basins.sort((a, b) => b.length - a.length);
    part2 = basins[0].length * basins[1].length * basins[2].length;

    return [part1, part2];
}