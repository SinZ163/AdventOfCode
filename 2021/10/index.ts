export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim().split(''));

    let part1 = 0;
    let part2 = 0;

    let charMap: Record<string,string> = {
        "[": "]",
        "{": "}",
        "(": ")",
        "<": ">"
    }
    let part1Scoring: Record<string, number> = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137 
    }
    let part2Scoring: Record<string, number> = {
        "(": 1,
        "[": 2,
        "{": 3,
        "<": 4 
    }

    let scores: number[] = [];

    for (let row of input) {
        let stack: string[] = [];
        // console.log(row);
        let corrupted = false;
        for (let char of row) {
            if (Object.keys(charMap).indexOf(char) !== -1) {
                stack.push(char);
            } else {
                if (charMap[stack[stack.length - 1]] !== char) {
                    // console.log("Broke at", char, stack, part1Scoring[char]);
                    part1 += part1Scoring[char];
                    corrupted = true;
                    break;
                } else {
                    stack.pop();
                }
            }
        }
        if (!corrupted) {
            let score = 0;
            while (stack.length > 0) {
                let cell = stack.pop();
                if (!cell) {
                    break;
                }
                score *= 5;
                // console.log(cell, part2, part2Scoring[cell]);
                score += part2Scoring[cell];
            }
            scores.push(score);
        }
    }
    scores.sort();
    // console.log(scores);
    part2 = scores[Math.round(scores.length / 2)];

    return [part1, part2];
}