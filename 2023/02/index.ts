
const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    for (let row of input) {
        row = row.substring("Game ".length);
        let index = row.indexOf(":");
        if (index == -1) continue;
        let gameId = Number.parseInt(row.substring(0, index));
        row = row.substring(index + 1);
        let sets = row.split(";");

        let impossible = false;
        let possibleRed = 0;
        let possibleGreen = 0;
        let possibleBlue = 0;
        for (let set of sets) {
            let entries = set.split(", ");
            for (let entry of entries) {
                var cell = entry.trim().split(" ");
                let value = Number.parseInt(cell[0]);
                if (cell[1] === "red") {
                    if (value > maxRed) {
                        impossible = true;
                    }
                    if (value > possibleRed) {
                        possibleRed = value;
                    }
                }
                if (cell[1] === "green") {
                    if (value > maxGreen) {
                        impossible = true;
                    }
                    if (value > possibleGreen) {
                        possibleGreen = value;
                    }
                }
                if (cell[1] === "blue") {
                    if (value > maxBlue) {
                        impossible = true;
                    }
                    if (value > possibleBlue) {
                        possibleBlue = value;
                    }
                }
            }
        }
        if (!impossible) {
            part1 += gameId;
        }
        part2 += possibleRed * possibleGreen * possibleBlue;
    }

    // p1 not 3702
    return [part1, part2];
}