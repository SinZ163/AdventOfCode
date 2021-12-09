export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim().split('').map(cell => Number.parseInt(cell)));

    let part1 = 0;
    let part2 = 0;
    let basins: Array<[number, number]>[] = [];
    let prevRowCache: Array<number|null> = [];
    for (let y = 0; y < input.length; y++) {
        let prevBasinHoriz: number|null = null;
        let currentRowCache: Array<number|null> = [];
        for (let x = 0; x < input[y].length; x++) {
            let currentCell = input[y][x];
            let isSmaller = true;
            if (x > 0) {
                if (input[y][x-1] <= currentCell) isSmaller = false;
            }
            if (y > 0) {
                if (input[y-1][x] <= currentCell) isSmaller = false;
            }
            if (x < input[y].length - 1) {
                if (input[y][x+1] <= currentCell) isSmaller = false;
            }
            if (y < input.length - 1) {
                if (input[y+1][x] <= currentCell) isSmaller = false;
            }
            if (isSmaller) {
                part1 += currentCell + 1;
            }
            if (currentCell < 9) {
                let foundBasin = false;
                if (y > 0) {
                    let northCache = prevRowCache[x];
                    if (northCache !== null) {
                        // console.log(y, northCache, basins.length, prevRowCache);
                        basins[northCache].push([x, y]);
                        if (prevBasinHoriz !== null && prevBasinHoriz != northCache) {
                            // console.log("merging prevBasin", prevBasinHoriz, basins[prevBasinHoriz]);
                            basins[northCache].push(...basins[prevBasinHoriz]);
                            basins.splice(prevBasinHoriz, 1);
                            // Update caches as they may be stale
                            if (prevBasinHoriz < northCache) {
                                northCache--;
                            }
                            for (let [i, cache] of currentRowCache.entries()) {
                                if (cache !== null) {
                                    if (prevBasinHoriz === cache) {
                                        currentRowCache[i] = northCache;
                                    }
                                    if (prevBasinHoriz < cache) {
                                        currentRowCache[i]!--;
                                    }
                                }
                                //if (y === 10) console.log("A", cache, northCache);
                            }
                            for (let [i, cache] of prevRowCache.entries()) {
                                if (cache !== null) {
                                    if (prevBasinHoriz === cache) {
                                        prevRowCache[i] = northCache;
                                    }
                                    if (prevBasinHoriz < cache) {
                                        prevRowCache[i]!--;
                                    }
                                    //if (y === 10) console.log("B", cache, northCache);
                                }
                            }
                        } else {
                            // console.log("Joining existing basin by vertical lookup", x, y, currentCell, prevBasinHoriz);
                        }
                        prevBasinHoriz = northCache;
                        foundBasin = true;
                    }
                }
                if (!foundBasin && prevBasinHoriz !== null) {
                    // console.log("Joining existing basin by horizontal cache", x, y, currentCell, prevBasinHoriz);
                    basins[prevBasinHoriz].push([x, y]);
                    foundBasin = true;
                }
                if (!foundBasin) {
                    basins.push([[x,y]]);
                    prevBasinHoriz = basins.length - 1;
                    // console.log("Creating new basin", x, y, currentCell, prevBasinHoriz);
                }
            } else {
                prevBasinHoriz = null;
            }
            currentRowCache.push(prevBasinHoriz);
        }
        //console.log(y, currentRowCache.length, currentRowCache);
        prevRowCache = [...currentRowCache];
    }
    // console.log(basins);
    basins.sort((a, b) => b.length - a.length);
    part2 = basins[0].length * basins[1].length * basins[2].length;

    return [part1, part2];
}