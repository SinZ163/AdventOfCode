//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let rules: [number, number][] = [];

    let canonicalOrder: number[] = [];

    let part1 = 0;
    let part2 = 0;

    function validateRules(input: number[]): number[][] {
        let invalidRules = [];
        for (let rule of rules) {
            let index0 = input.indexOf(rule[0]);
            if (index0 === -1) continue;
            let index1 = input.indexOf(rule[1]);
            if (index1 === -1) continue;
            if (index0 > index1) {
                invalidRules.push(rule);
            }
        }
        return invalidRules;
    }

    for (let row of input) {
        if (row.indexOf("|") > -1) {
            let ruleDigits: [number, number] = row.split("|").map(cell => cell|0); 
            let canonicalIndex0 = canonicalOrder.indexOf(ruleDigits[0]);
            let canonicalIndex1 = canonicalOrder.indexOf(ruleDigits[1]);
            if (canonicalIndex0 === -1 && canonicalIndex1 === -1) {
                canonicalOrder.push(ruleDigits[0], ruleDigits[1]);
            } else if (canonicalIndex0 === -1) {
                canonicalOrder.splice(canonicalIndex1, 0, ruleDigits[0]);
            } else if (canonicalIndex1 === -1) {
                canonicalOrder.splice(canonicalIndex0 + 1, 0, ruleDigits[1]);
            } else if (canonicalIndex0 > canonicalIndex1) {
                console.error("Warning:",ruleDigits, canonicalOrder);
                let rightDepth = 2;
                let leftDepth = 2;
                while(canonicalIndex0 > canonicalIndex1) {
                    let depth = rightDepth;
                    while(depth-- > 1) {
                        [canonicalOrder[canonicalIndex0+depth], canonicalOrder[canonicalIndex0+depth-1]] = [canonicalOrder[canonicalIndex0+depth-1], canonicalOrder[canonicalIndex0+depth]];
                    }
                    let moveRightSuccess = validateRules(canonicalOrder);
                    if (moveRightSuccess.length > 0) {
                        while(++depth <= rightDepth) {
                            [canonicalOrder[canonicalIndex0+depth], canonicalOrder[canonicalIndex0+depth-1]] = [canonicalOrder[canonicalIndex0+depth-1], canonicalOrder[canonicalIndex0+depth]];
                        } 
                    } else {
                        console.log(canonicalOrder);
                    }
                    if (validateRules(canonicalOrder).length > 0) {
                        throw new Error("Undoing right still results in chaos?");
                    }
                    depth = leftDepth;
                    while(depth-- > 1) {
                        [canonicalOrder[canonicalIndex1+depth], canonicalOrder[canonicalIndex1+depth-1]] = [canonicalOrder[canonicalIndex1+depth-1], canonicalOrder[canonicalIndex1+depth]];
                    }
                    let moveLeftSuccess = validateRules(canonicalOrder)
                    if (moveLeftSuccess.length > 0) {
                        while(++depth <= rightDepth) {
                            [canonicalOrder[canonicalIndex1+depth], canonicalOrder[canonicalIndex1+depth-1]] = [canonicalOrder[canonicalIndex1+depth-1], canonicalOrder[canonicalIndex1+depth]];
                        } 
                    } else {
                        console.log(canonicalOrder);
                    }
                    if (validateRules(canonicalOrder).length > 0) {
                        throw new Error("Undoing left still results in chaos?");
                    }
                    if (moveLeftSuccess.length > 0 && moveRightSuccess.length > 0) {
                        console.error("Cannot move in either direction without error??", canonicalOrder, moveLeftSuccess, moveRightSuccess);
                        if (leftDepth > rightDepth) {
                            rightDepth++;
                        } else {
                            leftDepth++;
                        }
                        if (leftDepth >= canonicalOrder.length - 2) {
                            console.error(leftDepth, canonicalOrder);
                            throw new Error("Left depth overflow");
                        }
                        if (rightDepth >= canonicalOrder.length - 2) {
                            console.error(rightDepth, canonicalOrder);
                            throw new Error("Right depth overflow");
                        }
                    }
                    console.log(canonicalOrder, leftDepth, rightDepth, moveLeftSuccess, moveRightSuccess, canonicalIndex0, canonicalIndex1, ruleDigits);
                    canonicalIndex0 = canonicalOrder.indexOf(ruleDigits[0]);
                    canonicalIndex1 = canonicalOrder.indexOf(ruleDigits[1]);
                }
            }
            rules.push(ruleDigits);
        } else if (row.indexOf(",") > -1) {
            let numbers = row.split(",").map(cell => cell|0);
            const invalidRules = validateRules(numbers);
            if (invalidRules.length === 0) {
                part1 += numbers[Math.floor(numbers.length / 2)];
            } else {
                //console.log(row, invalidRules);
            }
        }
    }
    console.log(canonicalOrder);

    return [part1, part2];
}