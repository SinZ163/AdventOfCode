export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim()).map(row => Number.parseInt(row));
    input.push(NaN);

    let elfTotals = [];

    let runningTotal = 0;
    for (let row of input) {
        if (isNaN(row)) {
            elfTotals.push(runningTotal);
            runningTotal = 0;
        } else {
            runningTotal += row;
        }
    }

    elfTotals.sort((a,b) => b - a);

    let part1 = elfTotals[0];
    let part2 = elfTotals[0] + elfTotals[1] + elfTotals[2];
    return [part1, part2];
}