//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim()).map(row => row.split(" ").map(cell => cell|0));

    let part1 = 0;
    let part2 = 0;

    for (let row of input) {
        function test(row: number[]) {
            let prev = row[0];
            let ascending: boolean | undefined = undefined;
            let pass = true;
            for (let i = 1; i < row.length; i++) {
                let cell = row[i];
                if (ascending === undefined) {
                    ascending = cell - prev > 0;
                } else {
                    if ((cell - prev > 0) != ascending) {
                        pass = false;
                        break;
                    }
                }
                if (Math.abs(cell - prev) > 3 || (cell - prev) === 0) {
                    pass = false;
                    break;
                }
                prev = cell;
            }
            return pass;
        }
        if (test(row)) {
            part1++;
            part2++;
        } else {
            // Is there a cell I can remove which makes it pass the test?
            for (let i = 0; i < row.length; i++) {
                let newRow = row.toSpliced(i, 1);
                if (test(newRow)) {
                    part2++;
                    //console.log(row, newRow, i);
                    break;
                }
            }
        }

    }

    return [part1, part2];
}