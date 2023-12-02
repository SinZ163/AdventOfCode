interface Action {
    type: "throwMonkey",
    value: number
}
interface Monkey {
    id: number,
    items: number[],
    operation: {
        type: OperationType,
        value: "old"|number
    },
    test: {
        type: "division",
        value: number
    },
    true: Action,
    false: Action,
    inspectCount: number,
}
type OperationType = "multiplication"|"addition";
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let currentMonkey = -1;
    let p1Monkeys: Monkey[] = [];
    let p2Monkeys: Monkey[] = [];
    
    for (let row of input) {
        if (row.startsWith("Monkey ")) {
            let monkeyId = Number.parseInt(row.substring("Moneky ".length), 10);
            currentMonkey = monkeyId;
            p1Monkeys[monkeyId] = {
                id: monkeyId,
                items: [],
                operation: {type: "addition", value: 0},
                test: {type: "division", value: 0},
                true: {type: "throwMonkey", value: -1},
                false: {type: "throwMonkey", value: -1},

                inspectCount: 0,
            }
        } else if (row.startsWith("  Starting items: ")) {
            let parsedRow = row.substring("  Starting items: ".length).split(", ").map(cell => Number.parseInt(cell, 10));
            p1Monkeys[currentMonkey].items = parsedRow;
        } else if (row.startsWith("  Operation: ")) {
            let operation = row.substring("  Operation: ".length).trimEnd();
            if (!operation.startsWith("new = old ")) {
                console.warn("Bad operation", currentMonkey);
                process.exit(1);
            }
            operation = operation.substring("new = old ".length);
            let operationType: OperationType;
            if (operation.startsWith("* ")) {
                operationType = "multiplication";
                operation = operation.substring("* ".length);
            } else if (operation.startsWith("+ ")) {
                operationType = "addition";
                operation = operation.substring("+ ".length);
            } else {
                console.warn("Unknown operator", currentMonkey);
                process.exit(1);
            }
            let value: "old"|number;
            if (operation === "old") {
                value = operation;
            } else {
                value = Number.parseInt(operation, 10);
            }
            p1Monkeys[currentMonkey].operation = {
                type: operationType,
                value,
            }
        } else if (row.startsWith("  Test: ")) {
            let testRow = row.substring("  Test: ".length);
            if (!testRow.startsWith("divisible by ")) {
                console.warn("Unknown test type", currentMonkey);
                process.exit(1);
            }
            let value = Number.parseInt(testRow.substring("divisible by ".length), 10);
            p1Monkeys[currentMonkey].test = {
                type: "division",
                value,
            }
        } else if (row.startsWith("    If true: ")) {
            let trueRow = row.substring("    If true: ".length);
            if (!trueRow.startsWith("throw to monkey ")) {
                console.warn("Unknown true action", currentMonkey);
                process.exit(1);
            }
            let value = Number.parseInt(trueRow.substring("throw to monkey ".length), 10);
            p1Monkeys[currentMonkey].true = {
                type: "throwMonkey",
                value,
            }
        } else if (row.startsWith("    If false: ")) {
            let falseRow = row.substring("    If false: ".length);
            if (!falseRow.startsWith("throw to monkey ")) {
                console.warn("Unknown false action", currentMonkey);
                process.exit(1);
            }
            let value = Number.parseInt(falseRow.substring("throw to monkey ".length), 10);
            p1Monkeys[currentMonkey].false = {
                type: "throwMonkey",
                value,
            }
        }
    }
    const CommonMultiplier = p1Monkeys.reduce((prev, current) => prev * current.test.value,1);
    //console.log(CommonMultiplier, p1Monkeys.map(monkey => monkey.test.value));

    p2Monkeys = p1Monkeys.map(monkey => ({
        ...monkey,
        items: [...monkey.items],
    }));
    //console.log(monkeys.map((monkey,i) => [i, monkey.items]));
    function roundLogic(worry: boolean, monkeys: Monkey[]) {
        for (let monkey of monkeys) {
            for (let item of monkey.items) {
                //console.log(`Monkey ${monkey.id}, ${item} Start`);
                switch(monkey.operation.type) {
                    case "addition":
                        if (monkey.operation.value === "old") {
                            item *= 2;
                        } else {
                            item += monkey.operation.value;
                        }
                        break;
                    case "multiplication":
                        if (monkey.operation.value === "old") {
                            item = item * item;
                        } else {
                            item *= monkey.operation.value;
                        }
                        break;
                }
                item = item % CommonMultiplier;
                //console.log(`Monkey ${monkey.id}, ${item} Operation`);
                if (worry) {
                    item /= 3;
                    item = Math.floor(item);
                }
                //console.log(`Monkey ${monkey.id}, ${item} Bored`);
                
                if ((item % monkey.test.value) === 0) {
                    monkeys[monkey.true.value].items.push(item);
                } else {
                    monkeys[monkey.false.value].items.push(item);
                }
                monkey.inspectCount++;
            }
            monkey.items = [];
        }
    }
    for (let round = 1; round <= 20; round++) {
        roundLogic(true, p1Monkeys);
    }
    for (let round = 1; round <= 10000; round++) {
        roundLogic(false, p2Monkeys);
        //if ((round % 1000) == 0 || round === 20)
        //    console.log(round, p2Monkeys.map((monkey,i) => [i, monkey.inspectCount, monkey.items]));
    }

    let p1SortedMonkeys = p1Monkeys.sort((a,b) => b.inspectCount - a.inspectCount);
    let p2SortedMonkeys = p2Monkeys.sort((a,b) => b.inspectCount - a.inspectCount);
    //console.log(sortedMonkeys);

    let part1 = p1SortedMonkeys[0].inspectCount * p1SortedMonkeys[1].inspectCount;
    let part2 = p2SortedMonkeys[0].inspectCount * p2SortedMonkeys[1].inspectCount;
    return [part1, part2];
}