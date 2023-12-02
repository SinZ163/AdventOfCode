class SpecializedSet {
    private xObject: Record<number, Set<number>> = {};
    public add(x: number, y: number) {
        if (!this.xObject[x]) {
            this.xObject[x] = new Set();
        }
        this.xObject[x].add(y);
    }
    public get size() {
        let size = 0;
        for (let set of Object.values(this.xObject)) {
            size += set.size;
        }
        return size;
    }
}

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.split(" "));
    
    let currentTailPositions = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    let currentHeadPosition = [0,0];

    let p1Set = new SpecializedSet();
    let p2Set = new SpecializedSet();
    p1Set.add(0,0);
    p2Set.add(0,0);
    //let p1VisitedTailCells = new Set<string>();
    //let p2VisitedTailCells = new Set<string>();
    //p1VisitedTailCells.add(currentTailPositions[0].join(","));
    //p2VisitedTailCells.add(currentTailPositions[0].join(","));

    for (let row of input) {
        let direction = row[0];
        let distance = parseInt(row[1], 10);
        let xDelta = 0;
        let yDelta = 0;
        switch(direction) {
            case "R":
                xDelta = 1;
                break;
            case "L":
                xDelta = -1;
                break;
            case "U":
                yDelta = 1;
                break;
            case "D":
                yDelta = -1;
                break;
        }
        for (let _ = 0; _ < distance; _++) {
            currentHeadPosition = [currentHeadPosition[0] + xDelta, currentHeadPosition[1] + yDelta];

            let [prevP1X, prevP1Y] = [...currentTailPositions[0]];
            let [prevP2X, prevP2Y] = [...currentTailPositions[8]];

            let head = currentHeadPosition;
            for (let i = 0; i < currentTailPositions.length; i++) {
                let currentTailPosition = currentTailPositions[i];
                let tailXDelta = head[0] - currentTailPosition[0];
                let tailYDelta = head[1] - currentTailPosition[1];
                //console.log(i,tailXDelta,tailYDelta, head, currentTailPositions[i], currentHeadPosition);
                let applyX = 0;
                let applyY = 0;
                // We have detached from the head
                if (Math.abs(tailXDelta) > 1 || Math.abs(tailYDelta) > 1) {
                    applyX = Math.sign(tailXDelta);
                    applyY = Math.sign(tailYDelta);
                    currentTailPositions[i] = [currentTailPosition[0] + applyX, currentTailPosition[1] + applyY];
                }
                head = currentTailPositions[i];
            }
            
            //console.log(currentHeadPosition, currentTailPositions);

            if (prevP1X !== currentTailPositions[0][0] || prevP1Y !== currentTailPositions[0][1]) {
                p1Set.add(currentTailPositions[0][0], currentTailPositions[0][1]);
            }            
            if (prevP2X !== currentTailPositions[8][0] || prevP2Y !== currentTailPositions[8][1]) {
                p2Set.add(currentTailPositions[8][0], currentTailPositions[8][1]);
            }
            //p1VisitedTailCells.add(currentTailPositions[0].join(","));
            //p2VisitedTailCells.add(currentTailPositions[8].join(","));
        }
    }
    //console.log(visitedTailCells);
    //let part1 = p1VisitedTailCells.size;
    //let part2 = p2VisitedTailCells.size;
    let part1 = p1Set.size;
    let part2 = p2Set.size;
    return [part1, part2];
}