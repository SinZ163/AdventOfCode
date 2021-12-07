export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split(",")
    .map(row => row.trim()).map(row => Number.parseInt(row));
/*
    let part1 = Number.MAX_SAFE_INTEGER;
    let part2 = Number.MAX_SAFE_INTEGER;

    let min = Math.min(...input);
    let max = Math.max(...input);
    for (let i = min; i <= max; i++) {
        let linearScore = 0;
        let triangleScore = 0;
        for (let point of input) {
            let n = Math.abs(i - point);
            linearScore += n;
            triangleScore += (n * (n+1)) / 2;
        }
        if (linearScore < part1) {
            part1 = linearScore;
        }
        if (triangleScore < part2) {
            part2 = triangleScore;
        }
        // console.table({part1,part2,i})
    }*/
    
    let part1 = 0;
    let part2 = 0;

    let maxLinear = Math.max(...input);
    let maxTriangle = maxLinear;
    let minLinear = Math.min(...input);
    let minTriangle = minLinear;
    while (true) {
        let midLinear = Math.round((maxLinear + minLinear) / 2);
        let midTriangle = Math.round((maxTriangle + minTriangle) / 2);

        let lowLinearScore = 0;
        for (let point of input) {
            lowLinearScore += Math.abs(minLinear - point);
        }
        let lowTriangleScore = 0;
        for (let point of input) {
            let n = Math.abs(minTriangle - point);
            lowTriangleScore += (n * (n+1)) / 2;
        }
        let highLinearScore = 0;
        for (let point of input) {
            highLinearScore += Math.abs(maxLinear - point);
        }
        let highTriangleScore = 0;
        for (let point of input) {
            let n = Math.abs(maxTriangle - point);
            highTriangleScore += (n * (n+1)) / 2;
        }
        //console.log("L", minLinear, lowLinearScore, highLinearScore, maxLinear);
        //console.log("T", minTriangle, lowTriangleScore, highTriangleScore, maxTriangle);
        // If the difference is 1, they are adjacent values and this is the end of the search
        if ((maxLinear - minLinear) === 1) {
            part1 = lowLinearScore < highLinearScore ? lowLinearScore : highLinearScore;
            part2 = lowTriangleScore < highTriangleScore ? lowTriangleScore : highTriangleScore;
            break;
        } else {
            if (lowLinearScore < highLinearScore) {
                maxLinear = midLinear;
            } else {
                minLinear = midLinear;
            }
            if (lowTriangleScore < highTriangleScore) {
                maxTriangle = midTriangle;
            } else {
                minTriangle = midTriangle;
            }
        }
    }

    return [part1, part2];
}