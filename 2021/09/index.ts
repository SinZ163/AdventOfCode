export default function main(rawInput: string): [string|number, string|number] {
    let width = rawInput.indexOf("\n");
    rawInput = rawInput.replace(/\r|\n/g, '');
    let input = rawInput.split('');

    const charCodeReference = "0".charCodeAt(0);

    let part1 = 0;
    let part2 = 0;
    let basins: Array<[number, number]>[] = [];
    let prevRowCache: Array<number|null> = [];
    for (let y = 0; y * width < input.length; y++) {
        let prevBasinHoriz: number|null = null;
        let currentRowCache: Array<number|null> = [];
        for (let x = 0; x < width; x++) {
            let currentCell = input[y*width + x].charCodeAt(0) - charCodeReference;
            if (currentCell < 9) {
                let isSmaller = true;
                if (x > 0) {
                    if (input[y*width+x-1].charCodeAt(0) - charCodeReference <= currentCell) isSmaller = false;
                }
                if (y > 0) {
                    if (input[(y-1)*width+x].charCodeAt(0) - charCodeReference <= currentCell) isSmaller = false;
                }
                if (x < width - 1) {
                    if (input[y*width+x+1].charCodeAt(0) - charCodeReference <= currentCell) isSmaller = false;
                }
                if ((y+1)*width < input.length) {
                    if (input[(y+1)*width+x].charCodeAt(0) - charCodeReference <= currentCell) isSmaller = false;
                }
                if (isSmaller) {
                    part1 += currentCell + 1;
                }
                
                let foundBasin = false;
                if (y > 0) {
                    let northCache = prevRowCache[x];
                    if (northCache !== null) {
                        // console.log(y, northCache, basins.length, prevRowCache);
                        basins[northCache].push([x, y]);
                        if (prevBasinHoriz !== null && prevBasinHoriz != northCache) {
                            // console.log("merging prevBasin", prevBasinHoriz, basins[prevBasinHoriz]);
                            basins[northCache].push(...basins[prevBasinHoriz]);
                            for (let [i, cache] of currentRowCache.entries()) {
                                if (cache !== null) {
                                    if (prevBasinHoriz === cache) {
                                        currentRowCache[i] = northCache;
                                    }
                                }
                                //if (y === 10) console.log("A", cache, northCache);
                            }
                            for (let [i, cache] of prevRowCache.entries()) {
                                if (cache !== null) {
                                    if (prevBasinHoriz === cache) {
                                        prevRowCache[i] = northCache;
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