export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trimEnd());

    const SOURCE_X = 500;
    const SOURCE_Y = 0;

    let grid: string[][] = [];
    let peakY = 0;

    for (let row of input) {
        let coords = row.split(" -> ");
        let prevX = -1;
        let prevY = -1;
        for (let [i,coord] of coords.entries()) {
            let [newX,newY] = coord.split(",").map(cell => Number.parseInt(cell));
            if (i !== 0) {
                let smallX = Math.min(newX, prevX);
                let largeX = Math.max(newX, prevX);
                let smallY = Math.min(newY, prevY);
                let largeY = Math.max(newY, prevY);
                for (let y = smallY; y <= largeY; y++) {
                    if (y > peakY) {
                        peakY = y;
                    }
                    if (grid[y] === undefined) {
                        grid[y] = [];
                    }
                    for (let x = smallX; x <= largeX; x++) {
                        grid[y][x] = "#";
                    }
                }
            }
            prevX = newX;
            prevY = newY;
        }
    }
    //console.log(peakY, grid);

    let part1 = -1;
    let part2 = -1;

    let iterationCount = 0;

    while (true) {
        // console.log(iterationCount, grid);
        let y = SOURCE_Y;
        let x = SOURCE_X;

        while (true) {
            //console.log(iterationCount, x, y);
            if ((y !== peakY + 2) && (grid[y] === undefined || grid[y][x] === undefined)) {
                y++;
            } else {
                if ((y !== peakY + 2) && grid[y][x - 1] === undefined) {
                    x--;
                    y++;
                } else if ((y !== peakY + 2) && grid[y][x + 1] === undefined) {
                    x++;
                    y++;
                } else {
                    // console.log(iterationCount, x, y);
                    if (grid[y - 1] === undefined) {
                        grid[y - 1] = [];
                    }
                    grid[y - 1][x] = ".";
                    iterationCount++;
                    break;
                }
            }
        }
        if (part1 === -1 && y > peakY) {
            part1 = iterationCount - 1;
            //console.log(grid);
        }
        if (y === SOURCE_Y + 1 && x === SOURCE_X) {
            part2 = iterationCount;
            break;
        }
    }

    return [part1, part2];
}