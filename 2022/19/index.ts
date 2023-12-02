interface Blueprint {
    blueprintId: number;
    oreCost: number;
    clayCost: number;
    obsidianOreCost: number;
    obsidianClayCost: number;
    geodeOreCost: number;
    geodeObsidianCost: number;
}

export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
    let input = rawInput.split("\n").map(row => row.trimEnd());
    let part1 = 0;
    let part2 = 0;

    let blueprints: Blueprint[] = [];


    for (let row of input) {
        let regOut = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(row);
        //console.log(regOut);
        if (regOut == null) {
            throw new Error(row);
        }
        let blueprintId = Number.parseInt(regOut[1]);
        let oreCost = Number.parseInt(regOut[2]);
        let clayCost = Number.parseInt(regOut[3]);
        let obsidianOreCost = Number.parseInt(regOut[4]);
        let obsidianClayCost = Number.parseInt(regOut[5]);
        let geodeOreCost = Number.parseInt(regOut[6]);
        let geodeObsidianCost = Number.parseInt(regOut[7]);
        blueprints.push({blueprintId, oreCost, clayCost, obsidianOreCost, obsidianClayCost, geodeOreCost, geodeObsidianCost})
        //console.log(row);
        //console.table({blueprintId, oreCost, clayCost, obsidianOreCost, obsidianClayCost, geodeOreCost, geodeClayCost});
    }

    for (let blueprint of blueprints) {
        //if (blueprint.blueprintId !== 1) continue;
        let oreRobots = 1;
        let clayRobots = 0;
        let obsidianRobots = 0;
        let geodeRobots = 0;

        let ore = 0;
        let clay = 0;
        let obsidian = 0;
        let geode = 0;

        console.log("===" + blueprint.blueprintId + "===");
        for (let minute = 1; minute <= 24; minute++) {
            console.log();
            console.log(`== Minute ${minute} ==`);
            let pendingGeodeRobots = 0;
            let pendingObsidianRobots = 0;
            let pendingClayRobots = 0;
            let pendingOreRobots = 0;

            let preferClayOverOre = false;
            let preferObsidianOverOre = false;
            let preferObsidianOverClay = false;
            let preferGeodesOverOre = false;
            let preferGeodesOverClay = false;
            let preferGeodesOverObsidian = false;

            
            // Should a geode machine be made over something else
            if (oreRobots && obsidianRobots) {
                // turn 20 
                // 
                let geodeOreRemaining = blueprint.geodeOreCost - ore;
                // 
                let geodeObsidianRemaining = blueprint.geodeObsidianCost - obsidian;
                // 
                let turnsForOre = Math.ceil(geodeOreRemaining / oreRobots);
                // 
                let turnsForObsidian = Math.ceil(geodeObsidianRemaining / obsidianRobots);
                // 
                let maxTurns = Math.max(turnsForOre, turnsForObsidian);

                // Simulate Ore Machine purchase
                {
                    let projectedOreRemaining = geodeOreRemaining + blueprint.oreCost - oreRobots - 1;
                    let projectedObsidianRemaining = geodeObsidianRemaining - obsidianRobots;
                    let projectedTurnsForOre = Math.ceil((projectedOreRemaining / (oreRobots+1)) + 1);
                    let projectedTurnsForObsidian = Math.ceil((projectedObsidianRemaining / obsidianRobots) + 1);
                    let projectedMax = Math.max(projectedTurnsForOre, projectedTurnsForObsidian);
                    if (projectedMax > maxTurns) {
                        preferGeodesOverOre = true;
                    }                   
                }
                // Simulate Clay machine purchase
                {
                    let projectedOreRemaining = geodeOreRemaining + blueprint.clayCost - oreRobots;
                    let projectedObsidianRemaining = geodeObsidianRemaining - obsidianRobots;
                    let projectedTurnsForOre = Math.ceil((projectedOreRemaining / oreRobots) + 1);
                    let projectedTurnsForObsidian = Math.ceil((projectedObsidianRemaining / obsidianRobots) + 1);
                    let projectedMax = Math.max(projectedTurnsForOre, projectedTurnsForObsidian);
                    if (projectedMax > maxTurns) {
                        preferGeodesOverClay = true;
                    }
                }
                // Simulate Obsidian machine purchase
                {
                    let projectedOreRemaining = geodeOreRemaining + blueprint.obsidianOreCost - oreRobots;
                    let projectedObsidianRemaining = geodeObsidianRemaining - obsidianRobots - 1;
                    let projectedTurnsForOre = Math.ceil((projectedOreRemaining / oreRobots) + 1);
                    let projectedTurnsForObsidian = Math.ceil((projectedObsidianRemaining / obsidianRobots) + 1);
                    let projectedMax = Math.max(projectedTurnsForOre, projectedTurnsForObsidian);
                    if (projectedMax > maxTurns) {
                        preferGeodesOverObsidian = true;
                    }
                }
            }
            // Should an obsidian machine be made over something else
            if (oreRobots && clayRobots) {
                let obsidianOreRemaining = (blueprint.obsidianOreCost - ore);
                let obsidianClayRemaining = (blueprint.obsidianClayCost - clay);
                let turnsForOre = Math.ceil(obsidianOreRemaining / oreRobots);
                let turnsForClay = Math.ceil(obsidianClayRemaining / clayRobots);
                let maxTurns = Math.max(turnsForOre, turnsForClay);
                
                // Simulate Ore Machine purchase
                {
                    let projectedObsidianOreRemaining = (obsidianOreRemaining + blueprint.oreCost - oreRobots - 1);
                    let projectedObsidianClayRemaining = (obsidianClayRemaining - clayRobots);
                    let projectedTurnsForOre = Math.ceil((projectedObsidianOreRemaining / (oreRobots + 1)) + 1);
                    let projectedTurnsForClay = Math.ceil((projectedObsidianClayRemaining / clayRobots) + 1);
                    let projectedMax = Math.max(projectedTurnsForClay, projectedTurnsForOre);
                    if (projectedMax > maxTurns) {
                        preferObsidianOverOre = true;
                    }
                }
                // Simulate Clay Machine purchase
                {
                    let projectedObsidianOreRemaining = (obsidianOreRemaining + blueprint.clayCost - oreRobots);
                    let projectedObsidianClayRemaining = (obsidianClayRemaining - clayRobots - 1);
                    let projectedTurnsForOre = Math.ceil((projectedObsidianOreRemaining / oreRobots) + 1);
                    let projectedTurnsForClay = Math.ceil((projectedObsidianClayRemaining / (clayRobots + 1)) + 1);
                    let projectedMax = Math.max(projectedTurnsForClay, projectedTurnsForOre);
                    if (projectedMax > maxTurns) {
                        preferObsidianOverClay = true;
                    }
                }


            }
            // Should a clay machine be made over something else
            if (oreRobots) {
                let oreRemaining = blueprint.clayCost - ore;
                let turnsRemaining =  Math.ceil(oreRemaining / oreRobots);

                let projectedOreRemaining = oreRemaining + blueprint.clayCost - oreRobots - 1;
                let projectedTurns = Math.ceil(projectedOreRemaining / (oreRobots + 1) + 1);
                if (projectedTurns > turnsRemaining) {
                    preferClayOverOre = true;
                } 

            }
            if (ore >= blueprint.geodeOreCost && obsidian >= blueprint.geodeObsidianCost) {
                console.log(`Spend ${blueprint.geodeOreCost} ore and ${blueprint.geodeObsidianCost} obsidian to start building a geode-cracking robot.`);
                pendingGeodeRobots++;
                ore -= blueprint.geodeOreCost;
                obsidian -= blueprint.geodeObsidianCost;
            }
            // TODO: Stop when at equilibium with ore?
            else if (ore >= blueprint.obsidianOreCost && clay >= blueprint.obsidianClayCost && !preferGeodesOverObsidian) {
                console.log(`Spend ${blueprint.obsidianOreCost} ore and ${blueprint.obsidianClayCost} clay to start building a obsidian-collecting robot.`);
                pendingObsidianRobots++;
                ore -= blueprint.obsidianOreCost;
                clay -= blueprint.obsidianClayCost;
            }
            // TODO: Stop when at equilibium with ore?
            else if (ore >= blueprint.clayCost && !preferObsidianOverClay && !preferGeodesOverClay) {
                console.log(`Spend ${blueprint.clayCost} ore to start building a clay-collecting robot.`);
                pendingClayRobots++;
                ore -= blueprint.clayCost;
            }
            // TODO: Stop when need to save up?
            else if (ore >= blueprint.oreCost && !preferClayOverOre && !preferObsidianOverOre && !preferGeodesOverOre) {
                console.log(`Spend ${blueprint.oreCost} ore to start building a ore-collecting robot.`);
                pendingOreRobots++;
                ore -= blueprint.oreCost;
            }

            ore += oreRobots;
            if (oreRobots)
                console.log(`${oreRobots} ore-collecting robots collects ${oreRobots} ore; you now have ${ore} ore.`);
            clay += clayRobots;
            if (clayRobots)
                console.log(`${clayRobots} clay-collecting robots collects ${clayRobots} clay; you now have ${clay} clay.`);
            obsidian += obsidianRobots;
            if (obsidianRobots)
                console.log(`${obsidianRobots} obsidian-collecting robots collects ${obsidianRobots} obsidian; you now have ${obsidian} obsidian.`);
            geode += geodeRobots;
            if (geodeRobots)
                console.log(`${geodeRobots} geode-cracking robots collects ${geodeRobots} geode; you now have ${geode} geode.`);



            oreRobots += pendingOreRobots;
            if (pendingOreRobots)
                console.log(`The new ore-collecting robot is ready; you now have ${oreRobots} of them.`);
            clayRobots += pendingClayRobots;
            if (pendingClayRobots)
                console.log(`The new clay-collecting robot is ready; you now have ${clayRobots} of them.`);
            obsidianRobots += pendingObsidianRobots;
            if (pendingObsidianRobots)
                console.log(`The new obsidian-collecting robot is ready; you now have ${obsidianRobots} of them.`);
            geodeRobots += pendingGeodeRobots;
            if (pendingGeodeRobots)
                console.log(`The new geode-cracking robot is ready; you now have ${geodeRobots} of them.`);
        }
    }

    return [part1, part2];
}