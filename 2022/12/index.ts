export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trimEnd());
    
    let start = -1;
    let end = -1;

    let width = input[0].length;
    let height = input.length;

    let map: number[] = [];

    for (let [y, row] of input.entries()) {
        let cells = row.split("").map(cell => cell.charCodeAt(0) - "a".charCodeAt(0));
        if (start === -1 || end === -1) {
            for (let [x,cell] of cells.entries()) {
                if (cell === -14) {
                    start = y*width + x; 
                } else if (cell === -28) {
                    end = y*width + x;
                }
                if (start !== -1 && end !== -1) {
                    break;
                }
            }
        }
        map = map.concat(cells);
    }
    map[start] = 0;
    map[end] = 25;

    let visitedCells = new Set<number>([end]);
    let p1Solution: number = -1;
    let p2Solution: number = -1;

    let nextIteration: Array<[number, number]> = [];
    function visit(current: number, trail: number): number[]|undefined {
        let validNeighbours = [];
        let currentCell = map[current];
        let x = current % width;
        let y = Math.floor(current / width);

        if (x > 0) {
            let left = current - 1;
            let leftDelta = currentCell - map[left];
            if (leftDelta <= 1 && !visitedCells.has(left)) {
                validNeighbours.push(left);
            }
        }
        if (x > 0) {
            let up = current - width;
            let upDelta = currentCell - map[up];
            if (upDelta <= 1 && !visitedCells.has(up)) {
                validNeighbours.push(up);
            }
        }
        if (x < (width - 1)) {
            let right = current + 1;
            let rightDelta = currentCell - map[right];
            if (rightDelta <= 1 && !visitedCells.has(right)) {
                validNeighbours.push(right);
            }
        }
        if (y < (height - 1)) {
            let down = current + width;
            let downDelta = currentCell - map[down];
            if (downDelta <= 1 && !visitedCells.has(down)) {
                validNeighbours.push(down);
            }
        }
        for (let validNeighbour of validNeighbours) {
            if (validNeighbour === start) {
                //console.log("Found a p1 solution", trail.length + 1);
                p1Solution = trail + 1;
                return;
            }
            if (p2Solution === -1 && map[validNeighbour] === 0) {
                //console.log("Found a p2 solution", trail.length + 1);
                p2Solution = trail + 1;
            }
            visitedCells.add(validNeighbour);
        }
        for (let validNeighbour of validNeighbours) {
            nextIteration.push([validNeighbour, trail + 1]);
        }
    }
    visit(end, 0);
    while (p1Solution === -1) {
        let currentIteration = [...nextIteration];
        nextIteration.length = 0;
        for (let [current, trail] of currentIteration) {
            visit(current, trail);
        }
    }

    let part1 = p1Solution;
    let part2 = p2Solution;
    return [part1, part2];
}