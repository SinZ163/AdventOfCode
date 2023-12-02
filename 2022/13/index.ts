type list = number|list[];

export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trimEnd());

    // not 6251
    let part1 = 0;
    let part2 = 0;

    let left: list = undefined!;
    let right: list = undefined!;
    
    let currentPairId = 1;
    let orderedList = [];
    function compare(left: list, right: list): 1|-1|0 {
        // console.log(left, right, typeof left, typeof right);
        if (typeof left === "number" && typeof right === "number") {
            if (left === right) return 0;
            return (left < right) ? -1 : 1;
        }
        //console.log("\t\t", typeof left, typeof right);
        left = typeof left === "number" ? [left] : left;
        right = typeof right === "number" ? [right] : right;
        for (let [i, cell] of left.entries()) {
            if (right[i] === undefined) {
                return 1;
            }
            let result = compare(cell, right[i]);
            console.log({left:cell, right:right[i], result});
            if (result !== 0) {
                return result;
            }
        }
        if (left.length < right.length) return -1;
        return 0;
    }
    for (let row of input) {
        if (row.length === 0) {
            currentPairId++;
            left = undefined!;
            right = undefined!;
        } else {
            let entry = JSON.parse(row);
            if (!left) {
                left = entry;
            } else {
                right = entry;
                //console.log(left, right);
                let result = compare(left, right);
                console.log(currentPairId, result);
                if (result === -1) {
                    //console.log(pairs.length);
                    part1 += currentPairId;
                    orderedList.push(left, right);
                } else {
                    orderedList.push(right, left);
                }
            }
        }
    }
    let cell1 = [[2]];
    let cell2 = [[6]];
    orderedList.push(cell1, cell2);
    orderedList.sort(compare);
    let divider1 = orderedList.findIndex(cell => cell === cell1);
    let divider2 = orderedList.findIndex(cell => cell === cell2);
    //console.log(orderedList, divider1, divider2);
    part2 = (divider1 + 1) * (divider2 + 1);
    //console.log(pairIds, pairIds.reduce((prev, current) => prev+current,0));
    return [part1, part2];
}