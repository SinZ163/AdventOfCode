//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part1Stats = {
        leftRight: 0,
        rightLeft: 0,
        down: 0,
        downRight: 0,
        downLeft: 0
    }
    let part2 = 0;
    
    for (let i = 0; i < input.length; i++) {
        const row = input[i];
        const leftRight = Array.from(row.matchAll(/XMAS/g)).length;
        const rightLeft = Array.from(row.matchAll(/SAMX/g)).length;
        part1Stats.leftRight += leftRight;
        part1Stats.rightLeft += rightLeft;
        part1 += leftRight + rightLeft;

        if (i > 0 && i < row.length - 1) {
            for (let j = 1; j < row.length - 1; j++) {
                if (!(input[i][j] === "A")) {
                    continue;
                }
                let negDiagonal = [input[i-1][j-1], input[i+1][j+1]];
                let xmasTrue = 0;
                if (negDiagonal[0] === "M" && negDiagonal[1] === "S") {
                    xmasTrue = 1;
                }
                if (negDiagonal[0] === "S" && negDiagonal[1] === "M") {
                    xmasTrue = 1;
                }
                if (xmasTrue != 1) continue;
                let posDiagonal = [input[i-1][j+1], input[i+1][j-1]];
                if (posDiagonal[0] === "M" && posDiagonal[1] === "S") {
                    part2++;
                }
                if (posDiagonal[0] === "S" && posDiagonal[1] === "M") {
                    part2++;
                }
            }
        }

        // Scanning down isn't needed once we are at the bottom
        if (i >= row.length - 3) {
            continue;
        }
        for (let j = 0; j < row.length; j++) {
            const down = input[i][j] + input[i+1][j] + input[i+2][j] + input[i+3][j];
            if (down === "XMAS" || down === "SAMX") {
                part1++;
                part1Stats.down++;
            }
            if (j < row.length - 3) {
                const downRight = input[i][j] + input[i+1][j+1] + input[i+2][j+2] + input[i+3][j+3];
                if (downRight === "XMAS" || downRight === "SAMX") {
                    part1++;
                    part1Stats.downRight++;
                }
            }
            if (j >= 3) {
                const downLeft = input[i][j] + input[i+1][j-1] + input[i+2][j-2] + input[i+3][j-3];
                if (downLeft === "XMAS" || downLeft === "SAMX") {
                    part1++;
                    part1Stats.downLeft++;
                }
            }
        }
    }
    console.table(part1Stats);

    return [part1, part2];
}