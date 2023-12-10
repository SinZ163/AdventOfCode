import Polygon from "polygon";
import Vec2 from "vec2";

//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let startPointX = -1;
    let startPointY = -1;

    let y = -1;
    for (let row of input) {
        y++;
        let startIndex = row.indexOf("S"); 
        if (startIndex === -1) continue;
        startPointX = startIndex;
        startPointY = y;
        break;
    }

    enum Direction {
        Left = 1,
        Right = 2,
        Up = 4,
        Down = 8,
    }

    let axis = 0;

    // check left
    if (startPointX > 0) {
        switch (input[startPointY][startPointX - 1]) {
            case "L":
            case "-":
            case "F":
                axis += Direction.Left;
                break;
        }
    }
    // check right
    if (startPointX < input[0].length -1) {
        switch (input[startPointY][startPointX + 1]) {
            case "J":
            case "-":
            case "7":
                axis += Direction.Right;
                break;
        }
    }
    
    // check above
    if (startPointY > 0) {
        switch (input[startPointY - 1][startPointX]) {
            case "7":
            case "|":
            case "F":
                axis += Direction.Up;
                break;
        }
    }
    // check below
    if (startPointY < input.length -1) {
        switch (input[startPointY + 1][startPointX]) {
            case "L":
            case "|":
            case "J":
                axis += Direction.Down;
                break;
        }
    }

    function mapAxisToLetter(axis: number) {
        switch(axis) {
            case (Direction.Left+Direction.Right):
                return "-";
            case (Direction.Left+Direction.Up):
                return "J";
            case (Direction.Left+Direction.Down):
                return "7";
            case (Direction.Right+Direction.Up):
                return "L";
            case (Direction.Right+Direction.Down):
                return "F";
            case (Direction.Up+Direction.Down):
                return "|";
        }
        return ".";
    }
    let startLetter = mapAxisToLetter(axis);

    let headA: [number, number, Direction] = [-1, -1, Direction.Down];
    let headB: [number, number, Direction] = [-1, -1, Direction.Down];

    // console.log(axis, startLetter, headA, headB);

    switch(startLetter) {
        case "|":
            headA = [startPointX, startPointY - 1, Direction.Up];
            headB = [startPointX, startPointY + 1, Direction.Down];
            break;
        case "-":
            headA = [startPointX + 1, startPointY, Direction.Right];
            headB = [startPointX - 1, startPointY, Direction.Left];
            break;
        case "L":
            headA = [startPointX, startPointY - 1, Direction.Up];
            headB = [startPointX + 1, startPointY, Direction.Right];
            break;
        case "J":
            headA = [startPointX - 1, startPointY, Direction.Left];
            headB = [startPointX, startPointY - 1, Direction.Up];
            break;
        case "7":
            headA = [startPointX, startPointY + 1, Direction.Down];
            headB = [startPointX - 1, startPointY, Direction.Left];
            break;
        case "F":
            headA = [startPointX + 1, startPointY, Direction.Right];
            headB = [startPointX, startPointY + 1, Direction.Down];
            break;
    }

    let part1 = 1;
    let part2 = 0;

    function navigateLetter(letter: string, oldDirection: Direction): Direction {
        switch(letter) {
            case "|":
                if (oldDirection === Direction.Up) {
                    return Direction.Up;
                } else {                    
                    return Direction.Down;
                }
            case "-":
                if (oldDirection === Direction.Left) {
                    return Direction.Left;
                } else {                    
                    return Direction.Right;
                }
            case "L":
                if (oldDirection === Direction.Left) {
                    return Direction.Up;
                } else {                    
                    return Direction.Right;
                }
            case "J":
                if (oldDirection === Direction.Right) {
                    return Direction.Up;
                } else {                    
                    return Direction.Left;
                }
            case "7":
                if (oldDirection === Direction.Right) {
                    return Direction.Down;
                } else {                    
                    return Direction.Left;
                }
            case "F":
                if (oldDirection === Direction.Up) {
                    return Direction.Right;
                } else {                    
                    return Direction.Down;
                }
        }
        return Direction.Down;
    }

    function checkMinMax(head: [number, number, Direction]) {
        if (head[0] < minX) {
            minX = head[0];
        } else if (head[0] > maxX) {
            maxX = head[0];
        }
        if (head[1] < minY) {
            minY = head[1];
        } else if (head[1] > maxY) {
            maxY = head[1];
        }
    }

    function navigatePipe(head: [number, number, Direction]): [number, number, Direction] {
        checkMinMax(head);
        let letter = input[head[1]][head[0]];
        //console.log(part1, head, letter);
        let newDirection: Direction = navigateLetter(letter, head[2]);
        switch(newDirection) {
            case Direction.Left:  
                return [head[0] - 1, head[1], Direction.Left];
            case Direction.Right:
                return [head[0] + 1, head[1], Direction.Right];
            case Direction.Up:
                return [head[0], head[1] - 1, Direction.Up];
            case Direction.Down:
                return [head[0], head[1] + 1, Direction.Down];
        }
    }

    let pipeHistory = [[startPointX, startPointY, 0], headA];
    let pipeBHistory = [headB];

    let minX = startPointX;
    let maxX = startPointX;
    let minY = startPointY;
    let maxY = startPointY;

    do {
        headA = navigatePipe(headA);
        pipeHistory.push(headA);
        headB = navigatePipe(headB);
        if ((headA[0] !== headB[0]) || (headA[1] !== headB[1])) {
            pipeBHistory.unshift(headB);
        } else {
            checkMinMax(headA);
        }
        part1++;
        //console.log(headA, headB, headA[0] !== headB[0], headA[1] !== headB[1]);
    } while ((headA[0] !== headB[0]) || (headA[1] !== headB[1]));
    pipeHistory = pipeHistory.concat(pipeBHistory);

    let potentials = [];
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (!pipeHistory.find(cell => cell[0] === x && cell[1] === y)) {
                potentials.push([x,y]);
            }
        }
    }

    let polygon = new Polygon(pipeHistory);
    for (let potential of potentials) {
        let success = polygon.containsPoint(new Vec2(potential));
        if (success) part2++;
    }

    return [part1, part2];
}