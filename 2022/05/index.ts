export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n");
    ;

    let stackMode = true;
    let p1Stacks: string[][] = [];
    let p2Stacks: string[][] = [];

    for (let row of input) {
        if (row.length < 4) {
            stackMode = false;
            //console.table(p1Stacks);
            continue;
        }
        if (stackMode) {
            let rowInfo = row.match(/.{1,4}/g) as string[];
            for (let [i, cell] of Array.from(rowInfo).entries()) {
                if (p1Stacks.length <= i) {
                    p1Stacks.push([]);
                    p2Stacks.push([]);
                }
                if (cell[1] !== " " && cell.codePointAt(0)! > 58) {
                    p1Stacks[i].push(cell[1]);
                    p2Stacks[i].push(cell[1]);
                }
            }
        } else {
            let rowInfo = row.match(/move (\d+) from (\d+) to (\d+)/);
            if (rowInfo == null) break;
            let quantity = parseInt(rowInfo[1]);
            let fromStack = parseInt(rowInfo[2]) - 1;
            let toStack = parseInt(rowInfo[3]) - 1;

            let movedCells = p2Stacks[fromStack].splice(0, quantity);
            p2Stacks[toStack].unshift(...movedCells);
            while (quantity-- > 0) {
                let movingCell = p1Stacks[fromStack].shift()!;
                p1Stacks[toStack].unshift(movingCell);
            }
            //console.table(p1Stacks);
            console.table(p2Stacks);
        }
    }

    let part1 = p1Stacks.map(p1Stacks => p1Stacks[0]).join("");
    let part2 = p2Stacks.map(p2Stacks => p2Stacks[0]).join("");

   
    return [part1, part2];
}