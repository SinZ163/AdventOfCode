//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number|bigint, string|number|bigint] {
    let input = rawInput.trimEnd().split(" ").map(Number);

    //console.log(input);

    let dataset: Record<number, number> = {0: 0, 1:0};

    for (let cell of input) {
        if (!dataset[cell]) {
            dataset[cell] = 1;
        } else {
            dataset[cell]++;
        }
    }
    // console.log(dataset);

    let part1 = 0;
    let part2 = 0;

    function getLength(dataset: Record<number, number>) {
        let count = 0;
        for (let data of Object.values(dataset)) {
            count += data;
        }
        return count;
    }
    
    let blinks = 0;
    while(blinks++ < 75) {
        let newDataset: Record<number, number> = {}
        for (let [key, count] of Object.entries(dataset)) {
            const number = Number(key);
            if (number === 0) {
                newDataset[1] = count;
                continue;
            }
            const numLength = Math.floor(Math.log10(number)) + 1;
            if (numLength % 2 === 0) {
                let leftHalf = Math.floor(number / 10**(numLength/2));
                let rightHalf = number % (10 ** (numLength / 2));
                if (!newDataset[leftHalf]) {
                    newDataset[leftHalf] = count;
                } else {
                    newDataset[leftHalf] += count;
                }
                if (!newDataset[rightHalf]) {
                    newDataset[rightHalf] = count;
                } else {
                    newDataset[rightHalf] += count;
                }
                continue;
            }
            
            if (!newDataset[number * 2024]) {
                newDataset[number * 2024] = count;
            } else {
                newDataset[number * 2024] += count;
            }
        }
        dataset = newDataset;
        //console.log(dataset);
        //if (blinks >= 6) break;
        if (blinks === 25) {
            part1 = getLength(dataset);
        }
    } 
    part2 = getLength(dataset);
/*
    while (blinks++ < 75) {
        //console.log(dataset[0]);
        //if (dataset.length > 1) break
        console.log(blinks, getLength(dataset), dataset.length);
        let newDataset: number[][] = [[]];
        for (let data of dataset) {
            for (let cell of data) {
                if (blinks > 19 && (cell === 0 || cell === 1 || cell === 2024)) {
                    // TODO: Replace with static count
                    continue;
                }
                if (cell === 0) {
                    newDataset[newDataset.length - 1].push(1);
                    continue;
                }
                const numLength = Math.floor(Math.log10(cell)) + 1;
                if (numLength % 2 === 0) {
                    let leftHalf = Math.floor(cell / 10**(numLength/2));
                    let rightHalf = cell % (10 ** (numLength / 2));
                    if (newDataset[newDataset.length - 1].length > 1_000_000) {
                        newDataset.push([]);
                    }
                    newDataset[newDataset.length - 1].push(leftHalf, rightHalf);
                    continue;
                }
                newDataset[newDataset.length - 1].push(cell * 2024);
            }
        }
        dataset = newDataset;
        if (blinks === 25) {
            part1 = getLength(dataset);
        }
    }
    part2 = getLength(dataset);
*/

    return [part1, part2];
}