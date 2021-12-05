import * as fs from "fs";

const input = fs.readFileSync("05/input.txt").toString().split("\n")
    .map(row => row.trim());

let part1 = 0;
let part2 = 0;

let db = input.map(row => row.match(/(\d+),(\d+) -> (\d+),(\d+)/)).filter(Boolean);

let board: Record<string,{d: number, h: number, v: number}> = {};
for (let entry of db) {
    if (!entry) continue;
    let x1 = Number.parseInt(entry[1]);
    let y1 = Number.parseInt(entry[2]);
    let x2 = Number.parseInt(entry[3]);
    let y2 = Number.parseInt(entry[4]);
    if (x1 === x2) {
        // x axis is identical, vertical line
        let delta = Math.abs(y2 - y1);
        let smallNumber = y2 > y1 ? y1 : y2;
        for (let i = smallNumber; i <= smallNumber+delta; i++) {
            let coord = `${x1},${i}`; 
            board[coord] = {
                v: board[coord]?.v + 1 || 1, 
                h: board[coord]?.h || 0,
                d: board[coord]?.d || 0
            };
        }
    }
    else if (y1 === y2) {
        // y axis is identical, horizontal line
        let delta = Math.abs(x2 - x1);
        let smallNumber = x2 > x1 ? x1 : x2;
        for (let i = smallNumber; i <= smallNumber+delta; i++) {
            let coord = `${i},${y1}`;
            board[coord] = {
                v: board[coord]?.v || 0, 
                h: board[coord]?.h + 1 || 1,
                d: board[coord]?.d || 0
            };
        }
    } else {
        let delta = x2 - x1;

        let polarity = 0;
        if (y2 === y1 + delta) {
            // positive
            polarity = 1;
        } else {
            // negative
            polarity = -1;
        }
        // console.log(entry[0], polarity);
        let smallX = x2 > x1 ? x1 : x2;
        let smallY = y2 > y1 ? y1 : y2;
        let largeY = y2 > y1 ? y2 : y1;
        let y = polarity > 0 ? smallY : largeY;
        for (let i = 0; i != Math.abs(delta) + 1; i += 1) {
            let coord = `${smallX+i},${y+(i*polarity)}`
            // console.log(entry[0], coord);
            board[coord] = {
                v: board[coord]?.v || 0, 
                h: board[coord]?.h || 0,
                d: board[coord]?.d + 1 || 1
            };
        }
    }
}
part1 = Object.values(board).filter(cell => cell.h+cell.v >= 2).length;
part2 = Object.values(board).filter(cell => cell.h+cell.v+cell.d >= 2).length;

// console.log(board);


console.log(part1, part2);