//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let sum = 0;
    let p2sum = 0;
    for (let row of input) {
        let first = 0;
        let p2first = 0;
        let last = 0;
        let p2last = 0;
        for (let i = 0; i < row.length; i++) {
            let charIndex = row.codePointAt(i)!;
            let num: number = 0; 
            if (charIndex >= 48 && charIndex < 58) {
                num = charIndex - 48;
                if (first == 0) first = num * 10;
                last = num;
            }
            let p2num = num;
            if (num == 0) {
                if (row.indexOf("one", i) === i) {
                    p2num = 1;
                    i++; // skip the n, impossible
                }
                else if (row.indexOf("two", i) === i) {
                    p2num = 2;
                    i++; // skip the w, impossible
                }
                else if (row.indexOf("three", i) === i) {
                    p2num = 3;
                    i += 3; // skip the hre
                }
                else if (row.indexOf("four", i) === i) {
                    p2num = 4;
                    i += 3; // skip the our
                }
                else if (row.indexOf("five", i) === i) {
                    p2num = 5;
                    i += 2; // skip the iv
                }
                else if (row.indexOf("six", i) === i) {
                    p2num = 6;
                    i += 2; // skip the ix
                }
                else if (row.indexOf("seven", i) === i) {
                    p2num = 7;
                    i += 3; // skip the eve
                }
                else if (row.indexOf("eight", i) === i) {
                    p2num = 8;
                    i += 3; // skip the igh
                }
                else if (row.indexOf("nine", i) === i) {
                    p2num = 9;
                    i += 2; // skip the in
                } else {
                    continue;
                }
            };
            if (!p2first) p2first = p2num * 10;
            p2last = p2num;
        }
        sum += (first) + (last);
        p2sum += (p2first) + (p2last);
    }

    let part1 = sum;
    let part2 = p2sum;

    return [part1, part2];
}