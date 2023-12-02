export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let cycleCount = 1;

    let x = 1;
    
    let part1 = 0;
    let part2 = "";

    function preCycleEvent() {
        if (cycleCount <= 240) {
            let cycleMod = ((cycleCount -1) % 40);
            console.log(cycleMod, x, Math.abs(x - cycleMod));
            if (Math.abs(x - cycleMod) < 2) {
                part2 += "#";
            } else {
                part2 += ".";
            }
            if ((cycleCount % 40) === 0) {
                part2 += "\r\n";
            }
        }
    }
    function postCycleEvent() {
        cycleCount++;
        if (cycleCount === 20 || (cycleCount - 20)%40 === 0) {
            //console.log(cycleCount, x);
            part1 += cycleCount * x;
        }
    }

    for (let row of input) {
        if (row.startsWith("noop")) {
            preCycleEvent();
            postCycleEvent();
            continue;
        }
        if (row.startsWith("addx")) {
            preCycleEvent();
            postCycleEvent();
            preCycleEvent();
            let deltaX = parseInt(row.substring("addx ".length), 10);
            //console.log(deltaX);
            x += deltaX;
            postCycleEvent();
        }
    }
    if (runCount === 0) {
        console.log(part2);
        part2 = "N/A";
    }
    return [part1, part2];
}