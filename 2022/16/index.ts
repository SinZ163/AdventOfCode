import { Worker } from "node:worker_threads";

export interface Node {
    id: string,
    flowRate: number,
    tunnelList: string[],
    optimizedList: Array<Node & {distance: number, path: string[]}>
}
export function computeP1Score(network: Record<string, Node>, cells: string[], distanceRemaining: number, currentNode: string, basepath: string[] = [], score: number = 0, depth: number = 0): [string[], number][] {
    let possibleScores: [string[], number][] = [];
    if (cells.length === 0) {
        return [[basepath, score]];
    }
    if (distanceRemaining > 0) {
        for (let [i,cellId] of cells.entries()) {
            let otherCells = [...cells];
            otherCells.splice(i, 1);
            let path = [...basepath, cellId];
            //console.log(path, distanceRemaining, score);//, score, path);
            let cell = network[currentNode].optimizedList.find(n => n.id === cellId);
            if (cell == null) throw new Error("WTF");
            let turnsRemaining = distanceRemaining - cell.distance - 1;
            if (turnsRemaining > 0) {
                possibleScores.push(...computeP1Score(network, otherCells, turnsRemaining, cellId, path, score + (turnsRemaining*cell.flowRate)));
            } else {
                //console.log(basepath, distanceRemaining, cellId, cell.distance);
                possibleScores.push([path, score]);
            }
        }
    } else {
        console.log("No");
    }
    return possibleScores;
}
export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
    let input = rawInput.split("\n").map(row => row.trimEnd());
    let part1 = 0;
    let part2 = 0;

    let network: Record<string,Node> = {}
    let nodesWithFlow = [];
    for (let row of input) {
        //Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        let id = row.substring("Valve ".length,"Valve ".length + 2);
        let semicolonIndex = row.indexOf(";");
        let flowRate = Number.parseInt(row.substring(row.indexOf("=")+1, semicolonIndex));
        let tunnelList = row.substring(semicolonIndex + " tunnels lead to valves ".length).split(", ");
        tunnelList[0] = tunnelList[0].trimStart();
        network[id] = {flowRate, tunnelList, id, optimizedList: []};
        if (flowRate > 0) {
            nodesWithFlow.push(id);
        }
        //console.log(nodeId, flowRate, tunnelList);
    }
    //console.log(nodesWithFlow);

    function populateOptimizedList(cell: string) {
        let visitedNodes: string[] = [cell];
        let distance = 1;
        let currentIteration = network[cell].tunnelList.map(cell => [cell]);
        while (currentIteration.length > 0) {
            let nextIteration = [];
            for (let path of [...currentIteration]) {
                let nodeId = path[path.length - 1];
                if (visitedNodes.indexOf(nodeId) === -1) {
                    visitedNodes.push(nodeId);
                    network[cell].optimizedList.push({...network[nodeId], distance, path});
                    nextIteration.push(...network[nodeId].tunnelList.map(cell => [...path, cell]));
                }
            }
            currentIteration = nextIteration;
            distance++;
        }
    }
    for (let nodeId of Object.keys(network)) {
        populateOptimizedList(nodeId);
    }

    // Optimization hack to run on large datasets to reduce stack pressure
    let p1Scores: [string[], number][] = [];
    let p2Scores: [string[], number][] = [];

    let p2Threads: Promise<[string[], number]>[] = [];
    for (let [i,firstCellId] of nodesWithFlow.entries()) {
        let otherCells = [...nodesWithFlow];
        otherCells.splice(i, 1);
        for (let [j, secondCellId] of otherCells.entries()) {
            let remainingCells = [...otherCells];
            remainingCells.splice(j, 1);
            let firstCell = network["AA"].optimizedList.find(n => n.id === firstCellId);
            if (!firstCell) throw new Error();
            //P1
            {
                let turnsRemaining = 30 - firstCell.distance - 1;
                let score = turnsRemaining * firstCell.flowRate;
                let secondCell = network[firstCellId].optimizedList.find(n => n.id === secondCellId);
                if (!secondCell) { throw new Error();}
                turnsRemaining = turnsRemaining - secondCell.distance - 1;
                score += (turnsRemaining) * secondCell.flowRate;
                p1Scores = p1Scores.concat(computeP1Score(network, remainingCells, turnsRemaining, secondCellId, [firstCellId,secondCellId], score));
            }
            //P2
            {
                let turnsRemaining = 26 - firstCell.distance - 1;
                let score = turnsRemaining * firstCell.flowRate;
                let secondCell = network["AA"].optimizedList.find(n => n.id === secondCellId);
                if (!secondCell) { throw new Error();}
                let turnsRemaining2 = 26 - secondCell.distance - 1;
                score += turnsRemaining2 * secondCell.flowRate;
                
                p2Threads.push(new Promise((resolve, reject) => {
                    let worker = new Worker(__dirname + "/p2worker.ts", {
                        workerData: {
                            network,
                            remainingCells,
                            turnsRemaining,
                            turnsRemaining2,
                            firstCellId,
                            secondCellId,
                            score
                        }
                    });
                    worker.on("message", resolve);
                    worker.on("error", reject);
                    worker.on("exit", code => {
                        if (code !== 0) {
                            reject(new Error("Worker stoped with exit code" + code));
                        }
                    });
                }));
                //console.table({score, turnsRemaining, turnsRemaining2, firstCellId, secondCellId});
                //p2Scores.push(computeP2Score(remainingCells, [turnsRemaining, turnsRemaining2], [firstCellId, secondCellId], [firstCellId,secondCellId], score).sort((a,b) => b[1] - a[1])[0]);
            }
        }
    }
    p1Scores.sort((a,b) => b[1] - a[1]);
    part1 = p1Scores[0][1];
    p2Scores = await Promise.all(p2Threads)
    p2Scores.sort((a,b) => b[1] - a[1]);
    console.log(p2Scores[0][0]);
    part2 = p2Scores[0][1];

    //p2 1904 too low

    return [part1, part2];
}