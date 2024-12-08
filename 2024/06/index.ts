//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    const WIDTH = input[0].length;
    const HEIGHT = input.length;

    const UP = 0;
    const RIGHT = 1;
    const DOWN = 2;
    const LEFT = 3;
    
    let guardCoord: [number, number] = [-1, -1];
    let guardDirection = UP;
    for (let [y, row] of input.entries()) {
        let guardPosition = row.indexOf("^");
        if (guardPosition !== -1) {
            guardCoord = [guardPosition, y];
            break;
        }
    }
    if (guardCoord[0] === -1) throw new Error("Did not find guard");

    let guardLocationSet: Record<number,Record<number,number>> = {}
    function addToSet(coord: [number, number], direction: number) {
        if (!guardLocationSet[coord[1]]) {
            guardLocationSet[coord[1]] = {};
        }
        if (!guardLocationSet[coord[1]][coord[0]]) {
            guardLocationSet[coord[1]][coord[0]] = 0;
        }
        guardLocationSet[coord[1]][coord[0]] |= 2**direction;
    }
    addToSet(guardCoord, guardDirection);
    let guardInbounds = true;

    const collisionLocations: [number, number, number, number][] = [];
    do {
        let nextObstruction = true;
        let nextCoord: [number, number] = [-1, -1];
        let origDirection = guardDirection;
        do {
            switch(guardDirection) {
                case UP:
                    nextCoord = [guardCoord[0], guardCoord[1] - 1];
                    break;
                case RIGHT:
                    nextCoord = [guardCoord[0] + 1, guardCoord[1]];
                    break;
                case DOWN:
                    nextCoord = [guardCoord[0], guardCoord[1] + 1];
                    break;
                case LEFT:
                    nextCoord = [guardCoord[0] - 1, guardCoord[1]];
                    break;
            }
            const nextInbounds = nextCoord[0] > -1 && nextCoord[0] < WIDTH && nextCoord[1] > -1 && nextCoord[1] < HEIGHT;
            nextObstruction = false;
            if (nextInbounds && input[nextCoord[1]][nextCoord[0]] === "#") {
                guardDirection++;
                if (guardDirection > LEFT) {
                    guardDirection = UP;
                }
                nextObstruction = true;
            }
            // Only log the collision location once we know the correct direction
            if (origDirection!=guardDirection && !nextObstruction) {
                collisionLocations.push([guardCoord[0], guardCoord[1], origDirection, guardDirection]);
                addToSet(guardCoord, guardDirection);
            }
        } while(nextObstruction);
        guardCoord = nextCoord;
        guardInbounds = guardCoord[0] > -1 && guardCoord[0] < WIDTH && guardCoord[1] > -1 && guardCoord[1] < HEIGHT;
        if (guardInbounds) {
            addToSet(guardCoord, guardDirection);
        }
    } while(guardInbounds);

    let part1 = 0;
    let part2 = 0;
    for (let y of Object.values(guardLocationSet)) {
        part1 += Object.values(y).length;
    }


    // Three type of loops
    // 1. A loop caused by adding a collision that will then cause the guard to hit the starting point in the correct orientation
    // 2. A loop caused by adding a 4th corner to a square
    // 2a. A loop caused by adding a 4th corner where one axis is length 0
    for (const collision of collisionLocations) {

    }

    function drawOutput() {
        let prevY = -1;
        for (let [y, yCells] of Object.entries(guardLocationSet)) {
            const yNum: number = y|0;
            if ((yNum - prevY) > 1) {
                for (let yDelta = 1; yDelta < (yNum - prevY); yDelta++) {
                    let string = "";
                    let i = -1;
                    while (i++ < WIDTH-1) {
                        if (input[prevY+yDelta][i] === "#") {
                            string += "#";
                        } else {
                            string += ".";
                        }
                    }
                    console.log(string);
                }
            }
            let prevX = -1;
            let string = "";
            for (let [x, xCell] of Object.entries(yCells)) {
                const xNum: number = x|0;
                if (xNum - prevX > 1) {
                    let i = 0;
                    for (let xDelta = 1; xDelta < (xNum - prevX); xDelta++) {
                        if (input[yNum][prevX+xDelta] === "#") {
                            string += "#";
                        } else {
                            string += ".";
                        }
                    }
                }
                const horizontal = (xCell & 2**LEFT)===2**LEFT || (xCell & 2**RIGHT)===2**RIGHT;
                const vertical = (xCell & 2**UP)===2**UP || (xCell & 2**DOWN)===2**DOWN;
                if (horizontal && vertical) {
                    string += "+";
                } else if (horizontal) {
                    string += "-";
                } else {
                    string += "|";
                }
                prevX = xNum;
            }
            while (string.length < WIDTH) {
                if (input[yNum][string.length] === "#") {
                    string += "#";
                } else {
                    string += ".";
                }
            }
            console.log(string);
            prevY = yNum;
        }
    }
    drawOutput();
    console.log(collisionLocations);
    return [part1, part2];
}