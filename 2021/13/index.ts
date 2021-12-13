export default function main(rawInput: string, run: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    let dots: number[][] = [];
    let instructionsIndex = 0;
    let maxWidth = 0;
    let maxHeight = 0;
    for (let [i,row] of input.entries()) {
        if (row.trim().length === 0) {
            instructionsIndex = i;
            break;
        }
        let cells = row.split(",").map(cell => Number.parseInt(cell));
        if (cells[0] > maxWidth) maxWidth = cells[0];
        if (cells[1] > maxHeight) maxHeight = cells[1];
        dots.push(cells);
    }
    // console.log(maxWidth, maxHeight, dots);
    // console.log(input[instructionsIndex + 1]);
    do {
        if (input[instructionsIndex + 1].trim().length === 0) break;
        let instruction = input[instructionsIndex + 1].match(/fold along (x|y)\=(\d+)/);
        if (!instruction) throw new Error("Cannot parse instruction");
        let foldPoint = Number.parseInt(instruction[2]);
        switch(instruction[1]) {
            case "x":
                for (let [i,cell] of dots.entries()) {
                    if (cell[0] > foldPoint) {
                        dots[i][0] = foldPoint - (cell[0] - foldPoint);
                    }
                }
                break;
            case "y":
                for (let [i,cell] of dots.entries()) {
                    if (cell[1] > foldPoint) {
                        dots[i][1] = foldPoint - (cell[1] - foldPoint);
                    }
                }
                break;
        }
        let newDots = dots.filter((cell, i) => dots.findIndex(cellB => cellB[0] === cell[0] && cellB[1] === cell[1]) === i);
        if (part1 === 0)
            part1 = newDots.length;
        dots = newDots;
        instructionsIndex++;
    } while (instructionsIndex + 1 < input.length);

    if (run === 0)
        printDots(dots);

    return [part1, part2];
}

function printDots(dots: number[][]) {
    let newDots: string[][] = [];
    for (let dot of dots) {
        let x = dot[0];
        let y = dot[1];
        while (newDots.length <= y) {
            newDots.push([]);
        }
        while (newDots[y].length <= x) {
            newDots[y].push(" ");
        }
        newDots[y][x] = "*";
    }
    for (let row of newDots) {
        console.log(row.join(''));
    }
}