//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;


    let times = input[0].substring(input[0].indexOf(":") + 1).split(" ").filter(e => e.length);
    let records = input[1].substring(input[1].indexOf(":") + 1).split(" ").filter(e => e.length);

    for (let [index,timeStr] of times.entries()) {
        let time = Number.parseInt(timeStr);
        let record = Number.parseInt(records[index]);

        let count = 0;
        for (let i = Math.ceil(record/time); i < time; i++) {
            if (((time - i) * i) > record) {
                count++;
            }
        }
        if (index === 0) {
            part1 = count;
        } else {
            part1 *= count;
        }
    }

    let p2Time = Number.parseInt(input[0].substring(input[0].indexOf(":") + 1).replaceAll(" ", ""));
    let p2Record = Number.parseInt(input[1].substring(input[1].indexOf(":") + 1).replaceAll(" ", ""));
    for (let i = Math.ceil(p2Record/p2Time); i < p2Time; i++) {
        if (((p2Time - i) * i) > p2Record) {
            part2++;
        } else if (part2 > 0) {
            break;
        }
    }

    return [part1, part2];
}