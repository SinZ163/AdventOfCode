export default function main(rawInput: string): [string|number, string|number] {
    let width = rawInput.indexOf("\r\n");
    // console.log(width);
    if (width === -1) {
        width = rawInput.indexOf("\n");
    }
    let input = rawInput.replace(/\r|\n/g, '').split('').map(cell => Number.parseInt(cell));

    let part1 = 0;
    let part2 = 0;

    // printInput(input, width);
    
    let step = 1;
    while(true) {
        let cellFlashes = [];
        let flashCount = 0;
        for (let i = 0; i < input.length; i++) {
            if (++input[i] > 9) {
                cellFlashes.push(i);
                input[i] = 0;
                flashCount++;
            }
        }
        // console.log(step, part1);
        while(cellFlashes.length > 0) {
            let newCellFlashes: number[] = [];
            for (let cellId of cellFlashes) {
                //if (cellId === 10) console.log(cellId);
                let westValid = cellId % width > 0;
                let eastValid = cellId % width < (width - 1);
                let northValid = cellId >= width;
                let southValid = cellId < input.length - width;
                //if (cellId === 10) console.table({westValid, eastValid, northValid, southValid});
                flashCount += bumpCoord(westValid, cellId - 1, input, newCellFlashes);
                flashCount += bumpCoord(eastValid, cellId + 1, input, newCellFlashes);

                flashCount += bumpCoord(northValid, cellId - width, input, newCellFlashes);
                flashCount += bumpCoord(southValid, cellId + width, input, newCellFlashes);

                flashCount += bumpCoord(westValid && northValid, cellId - width - 1, input, newCellFlashes);
                flashCount += bumpCoord(eastValid && northValid, cellId - width + 1, input, newCellFlashes);

                flashCount += bumpCoord(westValid && southValid, cellId + width - 1, input, newCellFlashes);
                flashCount += bumpCoord(eastValid && southValid, cellId + width + 1, input, newCellFlashes);
            }
            // printInput(input, width);
            // console.log("newCellFlashes",newCellFlashes);
            cellFlashes = newCellFlashes;
        }
        // console.log("PostStep", step, part1);
        // printInput(input, width);
        if (step <= 100) part1 += flashCount;
        let isSync = true;
        for (let cell of input) {
            if (cell !== 0) {
                isSync = false;
                break;
            }
        }
        if (isSync) break;
        step++;
    }
    part2 = step;

    return [part1, part2];
}

function bumpCoord(predicate: boolean, index: number, input: number[], cellFlashes: number[]) {
    let count = 0;
    if (predicate && input[index] !== 0) {
        if (++input[index] > 9) {
            cellFlashes.push(index);
            input[index] = 0;
            count++;
        }
    }
    return count;
}
function printInput(input: number[], width: number) {
    let printableArray = [];
    let newArray = [];
    for (let i = 0; i < input.length; i++) {
        if (i % width === 0 && i > 0) {
            printableArray.push(newArray.join(''));
            newArray = [];
        }
        newArray.push(input[i]);
    }
    printableArray.push(newArray.join(''))
    console.log(printableArray.join('\n'));
}