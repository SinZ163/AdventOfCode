//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let instructions = input[0];

    let p1CurrentLocation = "AAA";

    let p1CurrentStep = 0;

    let map: Record<string, [string,string]> = {}

    let i = 0;
    for (let row of input) {
        if (i++ < 2) continue;
        let [src, destStr] = row.split(" = ");
        let dest = destStr.split(", ");
        let left = dest[0].substring(1);
        let right = dest[1].substring(0, dest[1].length - 1);
        //console.log(src, left, right);
        map[src] = [left, right];

        if (p1CurrentLocation === src) {
            let currentInstruction = instructions[p1CurrentStep++ % instructions.length];
            if (currentInstruction === "L") {
                p1CurrentLocation = left;
            } else {
                p1CurrentLocation = right;
            }
            //console.log("> ",src, p1CurrentLocation);
        }
        if (p1CurrentLocation === "ZZZ") {
            break;
        }
    }
    if (map["AAA"] != null) {
        while (p1CurrentLocation !== "ZZZ") {
            let currentInstruction = instructions[p1CurrentStep++ % instructions.length];
            if (currentInstruction === "L") {
                p1CurrentLocation = map[p1CurrentLocation][0];
            } else {
                p1CurrentLocation = map[p1CurrentLocation][1];
            }
        }
    }
    let p2Nodes = [];
    for (let node of Object.keys(map)) {
        if (node.endsWith("A")) {
            p2Nodes.push(node);
        }
    }
    let p2CurrentStep = 0;
    console.log(p2Nodes);
    let tempSuccess = p2Nodes.map(node => 0);
    do {
        if (p2CurrentStep % 1_000_000_000 === 0) {
            console.log(p2CurrentStep);
        }  
        let currentInstruction = instructions[p2CurrentStep++ % instructions.length];
        for (let [i, node] of p2Nodes.entries()) {
            if (currentInstruction === "L") {
                p2Nodes[i] = map[node][0];
            } else {
                p2Nodes[i] = map[node][1];
            }
        }
        //console.log(p2Nodes);
        //if (p2CurrentStep > 10) break;
        /*let zCount = p2Nodes.filter(node => node.endsWith("Z"));
        if (zCount.length > 0) {
            for (let [i, node] of p2Nodes.entries()) {
                if (node.endsWith("Z")) {
                    tempSuccess[i]++;
                    console.log(`Slot ${i} found a Z after ${p2CurrentStep} iterations`);
                }
            }
            if (tempSuccess.filter(row => row < 3).length === 0) {
                break;
            }
            //console.log(p2Nodes);
            //break
        }*/
    } while (p2Nodes.some(node => !node.endsWith("Z")));

    let part1 = p1CurrentStep;
    let part2 = p2CurrentStep;

    return [part1, part2];
}