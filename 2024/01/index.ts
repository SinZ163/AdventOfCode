//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let leftList = [];
    let rightList = [];
    for (let row of input) {
        let cells = row.split("   ");
        leftList.push(cells[0]|0);
        rightList.push(cells[1]|0);
    }
    leftList.sort();
    rightList.sort();

    let part1 = 0;
    let part2 = 0;

    //const cache = new Map<number, number>();
    let prevVal = undefined;
    let cachedAnswer = undefined;
    for (let i = 0; i < leftList.length; i++) {
        let val = leftList[i];
        let rightVal = rightList[i];
        
        part1 += Math.abs(rightVal - val);
        
        //let cacheHit = cache.get(val);
        if (prevVal && prevVal === val) {
            part2 += cachedAnswer!;
            continue;
        }
        // if (cacheHit) {
        //     part2 += cacheHit;
        //     continue;
        // }
        let count = rightList.filter(row => row === val).length;
        /*let lastIndex = rightList.lastIndexOf(val);
        let firstIndex = rightList.indexOf(val);
        
        let count: number;
        if (firstIndex === lastIndex) {
            if (firstIndex === -1) {
                count = 0;
            } else {
                count = 1;
            }
        } else {
            count = lastIndex - firstIndex + 1;
        }*/
        //cache.set(val, val * count);
        cachedAnswer = val * count;
        prevVal = val;
        part2 += val * count;
    }

    return [part1, part2];
}
//│ part1   │ 2192892  │
//│ part2   │ 22962826 │