//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput;

    let part1 = 0;
    let part2 = 0;

    console.log(rawInput);

    let matches = input.matchAll(/(mul|do|don't)\((\d{1,3})?,?(\d{1,3})?\)/g);

    let state = "do";

    for (let match of matches) {
        if (match[1] === "mul") {
            let result = match[2] * match[3]; 
            part1 += result;
            if (state === "do") {
                part2 += result;
            } 
        } else if (match[1] === "do") {
            if (match[2] != null || match[3] != null) continue;
            state = "do";
        } else if (match[1] === "don't") {
            if (match[2] != null || match[3] != null) continue;
            state = "don't";
        }
    }

    return [part1, part2];
}