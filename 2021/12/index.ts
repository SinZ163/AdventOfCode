export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n");

    let map: Record<string, string[]> = {}

    for (let row of input) {
        if (row.length === 0) continue;
        let cleanRow = row.trim().split('-');
        if (map[cleanRow[0]]) {
            map[cleanRow[0]].push(cleanRow[1])
        } else {
            map[cleanRow[0]] = [cleanRow[1]];
        }
        if (map[cleanRow[1]]) {
            map[cleanRow[1]].push(cleanRow[0])
        } else {
            map[cleanRow[1]] = [cleanRow[0]];
        }
    }

    let routes: Array<{part2: boolean, route: string[]}> = [];

    navigateNode(routes, map, ["start"]);

    let part1 = routes.filter(row => !row.part2).length;
    let part2 = routes.length;

    return [part1, part2];
}

function navigateNode(routes: Array<{part2: boolean, route: string[]}>, map: Record<string, string[]>, prefix: string[], part2: boolean = false): Array<{part2: boolean, route: string[]}> {
    let currentNode = prefix[prefix.length - 1];
    for (let nextCell of map[currentNode]) {
        if (nextCell === "start") continue;
        if (nextCell === "end") {
            routes.push({part2, route: [...prefix, "end"]});
        }
        else if (nextCell.toLowerCase() === nextCell && prefix.indexOf(nextCell) !== -1) {
            if (!part2)
                routes = navigateNode(routes, map, [...prefix, nextCell], true);
        }
        else {
            routes = navigateNode(routes, map, [...prefix, nextCell], part2);
        }
    }
    return routes;
}