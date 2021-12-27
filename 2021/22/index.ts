interface Cuboid {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    zMin: number,
    zMax: number
}

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim()).map(row => row.match(/(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/));

    // console.log(input);

    let cuboids: Cuboid[] = [];

    for (let row of input) {
        if (!row) continue;
        let instruction = row[1] === "on" ? true : false;
        let xMin = Number.parseInt(row[2]);
        let xMax = Number.parseInt(row[3]);
        let yMin = Number.parseInt(row[4]);
        let yMax = Number.parseInt(row[5]);
        let zMin = Number.parseInt(row[6]);
        let zMax = Number.parseInt(row[7]);
        let newCube = {xMin, xMax, yMin, yMax, zMin, zMax};

        console.log(row[0]);
        let collisions = findCollisions(newCube, cuboids);
        if (collisions.length === 0) {
            if (instruction)
                cuboids.push(newCube);
        } else {
            console.log(collisions.length);
            if (row[0] === "on x=-22..28,y=-29..23,z=-38..16") {
                console.log(cuboids);
                console.log(collisions);
            }
            let cubeFragments = [newCube];
            for (let collision of collisions) {
                if (instruction) {
                    let newCubeFragments = [];
                    for (let cubeFragment of cubeFragments) {
                        if (!isSubset(cubeFragment, collision, row[0] === "on x=-22..28,y=-29..23,z=-38..16")) {
                            let commonCube = findIntercetion(cubeFragment, collision);
                            newCubeFragments.push(...createCubesFromCollision(cubeFragment, commonCube));
                        } else {
                            // console.log("Found a subset :D");
                        }
                    }
                    cubeFragments = newCubeFragments;
                } else {
                    let commonCube = findIntercetion(newCube, collision);
                    cuboids.splice(cuboids.indexOf(collision), 1);
                    cuboids.push(...createCubesFromCollision(collision, commonCube));
                }
            }
            if (instruction)
                cuboids.push(...cubeFragments);
        }
    }
    console.log(cuboids);

    let part1 = 0;
    let part2 = 0;

    return [part1, part2];
}
function isSubset(cube1: Cuboid, cube2: Cuboid, print=false): boolean {
    let xSubset = (cube1.xMax >= cube2.xMax && cube1.xMin <= cube2.xMin);
    let ySubset = (cube1.yMax >= cube2.yMax && cube1.yMin <= cube2.yMin);
    let zSubset = (cube1.zMax >= cube2.zMax && cube1.zMin <= cube2.zMin);
    return xSubset && ySubset && zSubset;
}
function findIntercetion(cube1: Cuboid, cube2: Cuboid): Cuboid {
    let xMin = Math.max(cube1.xMin, cube2.xMin);
    let yMin = Math.max(cube1.yMin, cube2.yMin);
    let zMin = Math.max(cube1.zMin, cube2.zMin);

    let xMax = Math.min(cube1.xMax, cube2.xMax);
    let yMax = Math.min(cube1.yMax, cube2.yMax);
    let zMax = Math.min(cube1.zMax, cube2.zMax);
    return {xMin, xMax, yMin, yMax, zMin, zMax};
}
function findCollisions(newCube: Cuboid, cuboids: Cuboid[]) {
    let collisions = [];
    let {xMin, xMax, yMin, yMax, zMin, zMax} = newCube;
    for (let cube of cuboids) {
        let collision = false;
        if (xMax >= cube.xMin && xMin <= cube.xMax) {
            // console.log("\tCollision on x axis?", cube.xMin, cube.xMax);
            collision = true;
        }
        if (collision && yMax >= cube.yMin && yMin <= cube.yMax) {
            // console.log("\tCollision on y axis?", cube.yMin, cube.yMax);
            collision = true;
        }
        if (collision && zMax >= cube.zMin && zMin <= cube.zMax) {
            // console.log("\tCollision on z axis?", cube.zMin, cube.zMax);
            collision = true;
        }
        if (collision) {
            collisions.push(cube);
        }
    }
    return collisions;
}
function createCubesFromCollision(cuboid: Cuboid, collision: Cuboid) {
    let cuboids = [];

    let {xMin, xMax, yMin, yMax, zMin, zMax} = cuboid;
    let {xMin:commonXMin, xMax:commonXMax, yMin:commonYMin, yMax:commonYMax, zMin:commonZMin, zMax:commonZMax} = collision;

    
    if (xMin < commonXMin) {
        cuboids.push({xMin, xMax: commonXMin - 1, yMin, yMax, zMin, zMax});
    }
    if (xMax > commonXMax) {
        cuboids.push({xMin: commonXMax + 1, xMax, yMin, yMax, zMin, zMax});
    }
    if (yMin < commonYMin) {
        cuboids.push({xMin: commonXMin, xMax: commonXMax, yMin, yMax: commonYMin - 1, zMin, zMax});
    }
    if (yMax > commonYMax) {
        cuboids.push({xMin: commonXMin, xMax: commonXMax, yMin: commonYMax + 1, yMax, zMin, zMax});
    }
    if (zMin < commonZMin) {
        cuboids.push({xMin: commonXMin, xMax: commonXMax, yMin: commonYMin, yMax: commonYMax, zMin, zMax: commonZMin - 1});
    }
    if (zMax > commonZMax) {
        cuboids.push({xMin: commonXMin, xMax: commonXMax, yMin: commonYMin, yMax: commonYMax, zMin: commonZMax + 1, zMax});
    }

    return cuboids;
}