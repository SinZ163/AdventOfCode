import * as fs from "fs";

const input = fs.readFileSync("04/input.txt").toString().split("\n")
    .map(row => row.trim());

let part1 = 0;
let part2 = 0;

const bingoNumbers = input[0].split(',');


let boards: [number, boolean][][] = [];
for (let [i, row] of input.entries()) {
    if (i === 0) continue;
    if (row.length === 0) {
        boards.push([]);
        continue;
    }
    row = row.replace(/  /g, ' ');
    boards[boards.length - 1].push(...row.split(" ").map<[number, boolean]>((i => [Number.parseInt(i), false])));
}
if (boards[boards.length - 1].length === 0) {
    boards.pop();
}

let winners: [number, number][] = [];
for (const bingo of bingoNumbers) {
    let number = Number.parseInt(bingo);
    for (let boardNo = 0; boardNo < boards.length; boardNo++) {
        if (winners.find(board => board[0] == boardNo)) {
            continue;
        }
        boards[boardNo] = boards[boardNo].map(cell => [cell[0], cell[1] ? cell[1] : number === cell[0]]);
        let board = boards[boardNo];
        
        for (const i of Array.from({length: 5}).keys()) {
            let horizontalPossible = true;
            let verticalPossible = true;
            let majorPossible = i === 0 && false;
            let minorPossible = i === 0 && false;
            for (const j of Array.from({length: 5}).keys()) {
                // console.log(boardNo, i, j);
                horizontalPossible = horizontalPossible && board[i*5 + j][1];
                verticalPossible = verticalPossible && board[j*5 + i][1];
                majorPossible = majorPossible && board[j*5 + j][1];
                minorPossible = minorPossible && board[(4-j)*5 + j][1];
            }
            if (horizontalPossible || verticalPossible || majorPossible || minorPossible) {
                winners.push([boardNo, number]);
            }
        }
    }
}


let unmarkedSumPart1 = boards[winners[0][0]].filter(row => row[1] === false).reduce((prev, current) => prev+current[0], 0);
part1 = unmarkedSumPart1 * winners[0][1];

let unmarkedSumPart2 = boards[winners[winners.length - 1][0]].filter(row => row[1] === false).reduce((prev, current) => prev+current[0], 0);
part2 = unmarkedSumPart2 * winners[winners.length - 1][1];

console.log(part1, part2);