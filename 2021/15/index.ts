import dijkstra from "node-dijkstra";

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    let width = input[0].trim().length;
    let p2width = width * 5;
    let cells: number[] = [];

    let p2Cells = [];

    for (let rawRow of input) {
        let row = rawRow.trimRight().split('');
        for (let cell of row) {
            cells.push(Number.parseInt(cell));
        }
    }
    for (let Yd = 0; Yd < 5; Yd++) {
        for (let y = 0; y < width; y++) {
            for (let Xd = 0; Xd < 5; Xd++) {
                for (let x = 0; x < width; x++) {
                    let newScore = (cells[y*width + x] + Xd + Yd) % 9;
                    p2Cells.push(newScore === 0 ? 9 : newScore);
                }
            }
        }
    }
    let route = new dijkstra();
    for (let node = 0; node < cells.length; node++) {
        route.addNode(node.toFixed(0), calcNeighbors(node, cells, width));
    }
    let output = route.path('0', (cells.length - 1).toFixed(0), {cost: true});
    // printRoute(output.path, width);
    part1 = output.cost;
    
    let route2 = new dijkstra();
    for (let node = 0; node < p2Cells.length; node++) {
        route2.addNode(node.toFixed(0), calcNeighbors(node, p2Cells, p2width));
    }
    let output2 = route2.path('0', (p2Cells.length - 1).toFixed(0), {cost: true});
    /*let tempArray = [];
    for (let node = 0; node < p2Cells.length; node++) {
        let x = node % p2width;
        let y = Math.floor(node / p2width);
        if (x === 0 && y > 0) {
            console.log(tempArray.join(''));
            tempArray = [];
        }
        tempArray.push(p2Cells[node]);
    }*/
    // printRoute(output2.path, p2width);
    part2 = output2.cost;
 
    return [part1, part2];
}
function calcNeighbors(node: number, cells: number[], width: number) {
    // if (width > 10) console.log("Neighbor logic p2?");
    // console.log(node, cells, width);
    let neighbors: Record<string, number> = {};
    if (node > width) {
        neighbors[(node - width).toFixed(0)] = cells[node - width];
    }
    if (node < width*(width - 1)) {
        neighbors[(node + width).toFixed(0)] = cells[node + width];
    }
    if (node % width > 0) {
        neighbors[(node - 1).toFixed(0)] = cells[node - 1];
    }
    if (node % width < (width - 1)) {
        neighbors[(node + 1).toFixed(0)] = cells[node + 1];
    }
    // console.log(neighbors);
    return neighbors;
}

function printRoute(dots: number[], width: number) {
    let newDots: string[][] = [];
    for (let dot of dots) {
        let x = dot % width;
        let y = Math.floor(dot / width);
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