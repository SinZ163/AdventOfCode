import { off } from "process";

type Coord = [number, number, number];
interface BaseScanner {
    beacons: Coord[],
    id: number
}
interface CompleteScanner extends BaseScanner {
    offset: Coord,
    rotation: [1|-1, 1|-1, 1|-1],
    type: "CompleteScanner"
}
interface UnknownScanner extends BaseScanner {
    type: "UnknownScanner"
}
type Scanner = CompleteScanner | UnknownScanner

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n");

    let scanners: Scanner[] = [];
    let beacons: Set<`${number},${number},${number}`> = new Set();

    for (let row of input) {
        row = row.trim();
        if (row.startsWith("---")) {
            if (scanners.length === 0) {
                scanners.push({
                    beacons: [],
                    type: "CompleteScanner",
                    offset: [0, 0, 0],
                    rotation: [1, 1, 1],
                    id: scanners.length
                });
            }
            else  {
                scanners.push({beacons: [], type: "UnknownScanner", id: scanners.length});
            }
        } else if (row.length === 0) {
            // first scanner is done lower down
            if (scanners.length > 1) {
                let self = scanners[scanners.length - 1];
                console.log("Self: ", self.id);
                //console.log(self.beacons.length);
                let success = false;
                for (let scanner of scanners) {
                    //console.log(scanner.beacons.length);
                    // don't compare yourself
                    if (scanner.id === scanners.length - 1) break;
                    // can only compare against baselined scanners
                    if (scanner.type === "UnknownScanner") continue;
                    for (let selfBeacon of self.beacons) {
                        //console.log(selfBeacon);
                        for (let refBeacon of scanner.beacons) {
                            if (refBeacon[0] === -391 && refBeacon[1] === 539 && refBeacon[2] === -444)
                                console.log("\t",refBeacon);
                            let xResult = overlapCoordsTest(scanner.beacons, self.beacons, refBeacon, selfBeacon, 0);
                            if (xResult) {
                                let [offsetX, rotationX, overlapX] = xResult;
                                console.log(`${self.id}, ${scanner.id}`);
                                console.log("Found the correct offset and rotation for x", offsetX, rotationX);
                                let yResult = overlapCoordsTest(scanner.beacons, self.beacons, refBeacon, selfBeacon, 1);
                                if (!yResult) continue;
                                let zResult = overlapCoordsTest(scanner.beacons, self.beacons, refBeacon, selfBeacon, 2);
                                if (!zResult) continue;                                
                                let [offsetY, rotationY, overlapY] = yResult;
                                let [offsetZ, rotationZ, overlapZ] = zResult;
                                let offset: Coord = [offsetX, offsetY, offsetZ];
                                let rotation: [1|-1, 1|-1, 1|-1] = [rotationX, rotationY, rotationZ]; 
                                console.log(`Offset is ${offset}`);
                                console.log(`Rotation is ${rotation}`);
                                scanners[self.id] = {
                                    beacons: self.beacons.map(row => normalizeCoord(row, rotation, offset)),
                                    type: "CompleteScanner",
                                    offset,
                                    rotation,
                                    id: self.id,
                                }
                                console.log(scanners[self.id]);
                                for (let beacon of scanners[self.id].beacons) {
                                    beacons.add(`${beacon[0]},${beacon[1]},${beacon[2]}`);
                                }
                                success = true;
                                break;
                            }
                        }
                        if (success) break;
                    }
                    if (success) break;
                }
            }
        } else {
            let coords = row.split(',').map(val => Number.parseInt(val)) as Coord;
            scanners[scanners.length - 1].beacons.push(coords);
            // first scanner, all beacons are new
            if (scanners.length === 1) {
                beacons.add(`${coords[0]},${coords[1]},${coords[2]}`);
            }
        }
    }
    // console.log(scanners);

    let part1 = beacons.size;
    let part2 = 0;

    return [part1, part2];
}

function normalizeCoord(coords: Coord, rotation: [1|-1, 1|-1, 1|-1], offset: Coord) : [number,number,number] {
    return [
        (coords[0] * rotation[0]) + offset[0],
        (coords[1] * rotation[1]) + offset[1],
        (coords[2] * rotation[2]) + offset[2]
    ]
}
function overlapCoordsTest(refBeacons: Coord[], selfBeacons: Coord[], refBeacon: Coord, selfBeacon: Coord, axis: 0|1|2): [number, 1|-1, Coord[]]|undefined {
    for (let rotation of ([1, -1] as Array<1|-1>)) {
        let xDiff = refBeacon[axis] - (selfBeacon[axis] * rotation);
        
        if (refBeacon[0] === -391 && refBeacon[1] === 539 && refBeacon[2] === -444)
            console.log("\t\t", "Attempting offset", xDiff, rotation);
        let selfBeaconsOffset = selfBeacons.map(row => (row[axis]*rotation) + xDiff);
        let result = refBeacons.filter(row => selfBeaconsOffset.includes(row[axis]));
        if (result.length >= 12) {
            return [xDiff, rotation, result];
        } else if (refBeacon[0] === -391 && refBeacon[1] === 539 && refBeacon[2] === -444) {
            console.log("\t\t", result.length);
        }
    }
}