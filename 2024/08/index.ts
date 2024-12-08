//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number|bigint, string|number|bigint] {
    let input = rawInput.split("\n");

    const WIDTH = input[0].length;
    const HEIGHT = input.length;

    const frequencies: Record<string, [number, number][]> = {};
    for (let [y,row] of input.entries()) {
        const yNum = Number(y);
        for (let [x, char] of row.split("").entries()) {
            const xNum = Number(x);
            if (char !== ".") {
                if (!frequencies[char]) {
                    frequencies[char] = [[xNum,yNum]];
                } else {
                    frequencies[char].push([xNum,yNum]);
                }
            }
        }
    }
    //console.log(frequencies);

    function validateNode([x, y]: readonly [number, number]) {
        if (x < 0 || x >= WIDTH) {
            return false;
        }
        if (y < 0 || y >= HEIGHT) {
            return false;
        }
        return true;
    }

    const p1 = new Set<string>();
    const p2 = new Set<string>();
    for (let [frquency, antennas] of Object.entries(frequencies)) {
        if (antennas.length < 2) continue;
        for (let i = 0; i < antennas.length - 1; i++) {
            for (let j = i+1; j < antennas.length; j++) {
                const iAntenna = antennas[i];
                const jAntenna = antennas[j];
                const xDelta = iAntenna[0] - jAntenna[0];
                const yDelta = iAntenna[1] - jAntenna[1];

                let depth = 0;
                while (true) {
                    let anyPass = false;
                    let posNode = [iAntenna[0] + xDelta*depth, iAntenna[1] + yDelta*depth] as const;
                    if (validateNode(posNode)) {
                        anyPass = true;
                        if (depth === 1)
                            p1.add(`${posNode[0]},${posNode[1]}`);
                        p2.add(`${posNode[0]},${posNode[1]}`);
                    }
                    let negNode = [jAntenna[0] - xDelta*depth, jAntenna[1] - yDelta*depth] as const;
                    if (validateNode(negNode)) {
                        anyPass = true;
                        if (depth === 1)
                            p1.add(`${negNode[0]},${negNode[1]}`);
                        p2.add(`${negNode[0]},${negNode[1]}`);
                    }
                    depth++;
                    if (!anyPass) {
                        break;
                    }
                }
            
                //console.log(frquency, iAntenna, jAntenna, antinode1, antinode2);
            }
        }
    }

    let part1 = p1.size;
    let part2 = p2.size;
    return [part1, part2];
}