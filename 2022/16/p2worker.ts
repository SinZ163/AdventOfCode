import {workerData, parentPort} from "node:worker_threads";
import { computeP1Score, Node } from ".";

let {
    network,
    remainingCells,
    turnsRemaining,
    turnsRemaining2,
    firstCellId,
    secondCellId,
    score
}: {
    network: Record<string,Node>,
    remainingCells: string[],
    turnsRemaining: number,
    turnsRemaining2: number,
    firstCellId: string,
    secondCellId: string,
    score: number
} = workerData;

let finalScore = computeP2Score(remainingCells, [turnsRemaining, turnsRemaining2], [firstCellId, secondCellId], [firstCellId,secondCellId], score).sort((a,b) => b[1] - a[1])[0];
parentPort?.postMessage(finalScore);

function computeP2Score(cells: string[], distancesRemaining: [number,number], currentNodes: [string,string], basepath: string[] = [], score: number = 0, depth: number = 0): [string[], number][] {
    //console.log(cells, basepath, score);
    let possibleScores: [string[], number][] = [];
    //console.log("|".repeat(depth), cells, basepath);
    if (cells.length === 0) return [[basepath, score]];
    for (let [i,firstCellId] of cells.entries()) {
        let cell0 = network[currentNodes[0]].optimizedList.find(n => n.id === firstCellId);

        if (cell0 == null) throw new Error("WTF");
        let turnsRemaining0 = distancesRemaining[0] - cell0.distance - 1;        
        for (let [j, secondCellId] of cells.entries()) {
            if (i === j) continue;
            let remainingCells = [...cells];
            //console.log("|".repeat(depth), ">", remainingCells);
            remainingCells.splice(i, 1);
            remainingCells.splice(remainingCells.indexOf(secondCellId), 1);
            //console.log("|".repeat(depth), ">", remainingCells, firstCellId, secondCellId);

            let cell1 = network[currentNodes[1]].optimizedList.find(n => n.id === secondCellId);
            if (cell1 == null) throw new Error("WTF2");
            let turnsRemaining1 = distancesRemaining[1] - cell1.distance - 1;
            let path = [...basepath];
            let newScore = score;
            if (turnsRemaining0 > 0) {
                newScore += turnsRemaining0 * cell0.flowRate;
                path.push(firstCellId);
            }
            if (turnsRemaining1 > 0) {
                //console.log("1",path, secondCellId, score);
                newScore += turnsRemaining1 * cell1.flowRate;
                path.push(secondCellId);
            }
            if (turnsRemaining0 > 0 && turnsRemaining1 > 0) {
                //console.log(turnsRemaining0, turnsRemaining1, cell0.distance, cell1.distance);
                possibleScores.push(...computeP2Score(remainingCells, [turnsRemaining0, turnsRemaining1], [firstCellId, secondCellId], path, newScore, depth+1));
            } else if (turnsRemaining0 > 0) {
                possibleScores.push(...computeP1Score(network, remainingCells, turnsRemaining0, firstCellId, path, newScore, depth + 1));
            } else if (turnsRemaining1 > 0) {
                possibleScores.push(...computeP1Score(network, remainingCells, turnsRemaining1, secondCellId, path, newScore, depth + 1));
            } else {
                //console.log("Did not finish", basepath, distancesRemaining, firstCellId, secondCellId, cell0.distance, cell1.distance);
                possibleScores.push([path, score]);
            }
        }
    }
    return possibleScores;
}