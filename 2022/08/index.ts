
import * as fs from "fs";
interface Cell {
    sides: string[],
    top: number,
    left: number,
    right: number,
    bottom: number,
}

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trim().split("").map(cell => Number.parseInt(cell)));

    let part1 = 0;
    let part2 = 0;

    let grid: Cell[][] = [];
    for (let row of input) {
        let gridRow = row.map(cell => ({sides: [], top: 0, left: 0, right: 0, bottom: 0}));
        grid.push(gridRow);
    }

    for (let i = 0; i < input[0].length; i++) {
        grid[0][i].sides.push("outside_top");
        grid[grid.length - 1][i].sides.push("outside_bottom");
    }
    let topScan = [...input[0]];
    for (let y = 1; y < input.length - 1; y++) {
        let row = input[y];
        grid[y][0].sides.push("outside_left");
        let leftScan = row[0];
        for (let x = 1; x < row.length - 1; x++) {
            if (row[x] > leftScan) {
                grid[y][x].sides.push("left");
                grid[y][x].left = x;
                //console.log(x,y,row[x], "left");
                leftScan = row[x];
            } else {
                let left = 0;
                while ((x - left - 1) > 0) {
                    if (row[x] > row[(x - left - 1)]) {
                        left++;
                    } else {
                        left++;
                        break;
                    }
                }
                grid[y][x].left = left;
            }
            if (row[x] > topScan[x]) {
                grid[y][x].sides.push("top");
                grid[y][x].top = y;
                //console.log(x,y,row[x], "top");
                topScan[x] = row[x];
            } else {
                let top = 0;
                while ((y - top - 1) > 0) {
                    if (row[x] > input[(y - top - 1)][x]) {
                        top++;
                    } else {
                        top++;
                        break;
                    }
                }
                grid[y][x].top = top;
            }
        }
        let rightScan = row[row.length - 1];
        for (let x = row.length - 2; x > 0; x--) {
            if (row[x] > rightScan) {
                grid[y][x].sides.push("right");
                grid[y][x].right = row.length - 1 - x;
                rightScan = row[x];
            } else {
                let right = 0;
                while ((x + right + 1) < row.length - 1) {
                    if (row[x] > row[x+right+1]) {
                        right++;
                    } else {
                        right++;
                        break;
                    }
                }
                grid[y][x].right = right;
            }
        }
        grid[y][row.length - 1].sides.push("outside_right");
    }
    
    let bottomScan = [...input[input.length - 1]];
    for (let y = input.length - 2; y > 0; y--) {
        let row = input[y];
        for (let x = 1; x < row.length - 1; x++) {
            if (row[x] > bottomScan[x]) {
                grid[y][x].sides.push("bottom");
                grid[y][x].bottom = input.length - 1 - y;
                //console.log(x,y,row[x], "top");
                bottomScan[x] = row[x];
            } else {
                let bottom = 0;
                while ((y + bottom + 1) < input.length - 1) {
                    if (row[x] > input[(y + bottom + 1)][x]) {
                        bottom++;
                    } else {
                        bottom++;
                        break;
                    }
                }
                grid[y][x].bottom = bottom;
            }
        }
    }
    // fs.writeFileSync("science.json", JSON.stringify(grid, undefined, 4));
    for (let [y, row] of grid.entries()) {
        for (let [x,cell] of row.entries()) {
            let score = cell.top * cell.left * cell.right * cell.bottom;
            if (score > part2) {
                //console.log(cell, score, x,y);
                part2 = score;
            }
            if (cell.sides.length > 0) {
                part1++;
            }
        } 
    }
    //part1 = visible.length;
    // part2 not 216720
   
    return [part1, part2];
}