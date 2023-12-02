//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim()).map(row => Number.parseInt(row));

    let part1 = 0;
    let part2 = 0;

    return [part1, part2];
}