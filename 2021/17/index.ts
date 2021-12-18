export default function main(rawInput: string): [string|number, string|number] {
    // console.log(rawInput);
    let input = rawInput.match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
    
    let part1 = 0;
    let part2 = 0;
    if (!input) throw new Error("Bad input");

    const targetXMin = Number.parseInt(input[1]);
    const targetXMax = Number.parseInt(input[2]);
    const targetXDelta = targetXMax - targetXMin;

    const targetYMin = Number.parseInt(input[3]);
    const targetYMax = Number.parseInt(input[4]);
    const targetYDelta = targetYMax - targetYMin;


    let peakY = Math.abs(targetYMin) - 1;
    part1 = peakY*(peakY + 1) / 2; 

    part2 = (targetXDelta + 1) * (targetYDelta + 1);

    let triangles = [];
    for (let x = targetXMin; x <= targetXMax; x++) {
        let triangleValue = (Math.sqrt(8*x + 1) - 1) / 2;
        if (Number.isInteger(triangleValue)) {
            triangles.push(triangleValue);
        } 
    }
    if (triangles.length === 0) {
        throw new Error("Oh this approach does not work");
    }

    let ySteps: Record<number, number[]> = {}
    let peakSteps = 0;
    for (let y = targetYMin/2 + 1; y <= peakY; y++) {
        let velocity = y-1;
        let distance = y;
        let step = 1;

        while (distance >= targetYMin) {
            step++;
            distance += velocity--;
            if (step > peakSteps) peakSteps = step;
            if (distance >= targetYMin && distance <= targetYMax) {
                ySteps[step] ? ySteps[step].push(y) : ySteps[step] = [y];
                // break;
            }
            
        }
    }
    // console.log(ySteps);

    let permutations = [];

    for (let xv = triangles[0]; (2*xv - 1) <= targetXMax; xv++) {
        // console.log("xv", xv);
        
        let yHit = new Set();
        let velocity = xv;
        let distance = 0;
        let step = 0;
        while (distance <= targetXMax && step < peakSteps) {
            // console.log(xv, distance, velocity, stepBounds);
            step++;
            distance += velocity;
            velocity -= Math.sign(velocity);
            if (distance >= targetXMin && distance <= targetXMax) {
                // console.log(xv, step);
                if (ySteps[step]) {
                    for (let y of ySteps[step]) {
                        if (!yHit.has(y)) {
                            permutations.push([xv, y]);
                            part2++;
                        }
                        yHit.add(y);
                        // console.log(yHit);
                    }
                }
            }
        }
    }
    // console.log(permutations);

    return [part1, part2];
}