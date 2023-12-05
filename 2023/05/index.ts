//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
enum Mode {
    init,
    seedToSoil,
    soilToFert,
    fertToWater,
    waterToLight,
    lightToTemp,
    tempToHumid,
    humidToLocation
}

function tryGet(map: Record<number,number>, key: number) {
    if (map[key] != null) return map[key];
    return key;
}

export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = Number.MAX_SAFE_INTEGER;
    let part2 = Number.MAX_SAFE_INTEGER;

    let p1Values: number[] = [];
    let p2Values: [number,number][] = [];
    let p2NewValues: [number,number][] = [];
    let p1Mapped: Record<number, boolean> = {};
    let mode = Mode.init;
    for (let row of input) {
        if (row.startsWith("seeds:")) {
            let values = row.substring("seeds: ".length).split(" ").map(val => Number.parseInt(val));
            p1Values = [...values];
            for (let i = 0; i < values.length; i += 2) {
                p2Values.push([values[i], values[i+1]]);
            }
            continue;
        }
        if (row.startsWith("seed")) {
            mode = Mode.seedToSoil;
            p1Mapped = {};
            continue;
        }
        if (row.startsWith("soil")) {
            mode = Mode.soilToFert;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.startsWith("fert")) {
            mode = Mode.fertToWater;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.startsWith("water")) {
            mode = Mode.waterToLight;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.startsWith("light")) {
            mode = Mode.lightToTemp;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.startsWith("temp")) {
            mode = Mode.tempToHumid;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.startsWith("humid")) {
            mode = Mode.humidToLocation;
            p1Mapped = {};
            p2Values = [...p2NewValues, ...p2Values];
            p2NewValues = [];
            continue;
        }
        if (row.length < 3) continue;
        let [destStr, srcStr, rangeStr] = row.split(" ");
        let src = Number.parseInt(srcStr);
        let dest = Number.parseInt(destStr);
        let range = Number.parseInt(rangeStr);

        for (let i = 0; i < p1Values.length; i++) {
            const p1Number = p1Values[i];
            if (p1Number >= src && p1Number < (src+range) && p1Mapped[i] == null) {
                p1Values[i] = p1Number + (dest - src);
                p1Mapped[i] = true;
            }
        }        
        // loop backwards to make deleting elements in array preserve indexing
        for (let i = p2Values.length - 1; i >= 0; i--) {
            let [val, valRange] = p2Values[i];

            /**
                Case 1, entire range too small
                val: [---]
                src:        [---]

                Case 2, entire range too large
                val:        [---]
                src: [---]

                Case 3, fully overlaps
                val:      [--]
                src:   [--------]
 
                Must overlap somewhat, but not completely
                three more posible cases

                Case 4, the start overlaps, end doesn't
                val: [---]
                src:   [---]

                Case 5, the end overlaps, the start doesn't
                val:   [---]
                src: [---]

                Case 6, neither the start nor end overlaps, the middle does
                val:  [-------]
                src:    [---]
            */

            // case 1
            if ((val + valRange) < src) {}
            // case 2
            else if (val > (src + range)) {}
            // case 3
            else if (val >= src && (val+valRange) < (src+range)) {
                //console.log("Full overlap case", Mode[mode], {src,dest,range}, {val,valRange});
                p2NewValues.push([val + (dest - src), valRange]);
                p2Values.splice(i, 1);
            }
            // Case 4
            else if (val <= src) {
                //console.log("Case 1", Mode[mode], {src,dest,range}, {val,valRange});
                // this diff is the amount "left" of the range that maps, and should preserve original values, which becomes the new range
                let diff = src - val;
                p2Values[i][1] = diff;
                p2NewValues.push([dest, valRange - diff]);
            }
            // Case 5
            else if ((val+valRange) >= (src+range)) {
                //console.log("Case 2", Mode[mode], {src,dest,range}, {val,valRange});
                // this diff is the amount "right" of the range that maps, and should preserve original values.
                let diff = (val+valRange) - (src+range);
                p2Values[i] = [src+range, diff];
                p2NewValues.push([val + (dest-src), valRange - diff]);
            }
            // Case 6
            else {
                //console.log("Case 3", Mode[mode], {src,dest,range}, {val,valRange});
                let leftDiff = src - val;
                let rightDiff = (val+valRange) - (src+range);
                p2Values[i][1] = leftDiff;
                p2Values.push([src+range, rightDiff]);
                p2NewValues.push([dest, range]);
            }
        } 
    }
    //console.log(values);
    for (let number of p1Values) {
        if (number < part1) {
            part1 = number;
        }
    }
    for (let pair of p2Values) {
        if (pair[0] < part2) {
            part2 = pair[0];
        }
    }
    for (let pair of p2NewValues) {
        if (pair[0] < part2) {
            part2 = pair[0];
        }
    }

    return [part1, part2];
}