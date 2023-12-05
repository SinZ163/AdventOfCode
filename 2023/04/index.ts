//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    let dupes = new Map<number, number>();

    let i = 1;
    for (let row of input) {
        let score = 0;
        let [winning, rawNumbers] = row.split(" | ");
        let winningNumbers = winning.substring(winning.indexOf(":") + 1).split(" ").map(row => row.trim());
        let numbers = rawNumbers.split(" ");
        for (let number of numbers) {
            let cleanNumber = number.trim();
            if (number.length == 0) continue;
            if (winningNumbers.indexOf(cleanNumber) != -1) {
                score++;
            }
        }
        let currentDupe = dupes.get(i) ?? 0;
        if (score > 0) {
            part1 += Math.pow(2, score - 1);
            let totalCount = currentDupe + 1;
            for (let x = 1; x <= score; x++) {
                let prevDupes = dupes.get(i + x) ?? 0;
                dupes.set(i + x, prevDupes + totalCount);
            }
        }
        //console.table({winningNumbers, numbers, score});
        //console.log(dupes);
        part2 += currentDupe + 1;
        i++;
    }


    return [part1, part2];
}