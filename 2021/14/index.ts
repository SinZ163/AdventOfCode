export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    let rawPolymer = input[0].trim().split('');

    const firstLetter = rawPolymer[0];

    let map: Record<string, string> = {}

    for (let i = 1; i < input.length; i++) {
        if (input[i].trimEnd().length === 0) continue;
        let row = input[i].trimEnd().split(' -> ');
        map[row[0]] = row[1];
    }
    // console.log(map);
    let polymer: Record<string, number> = {}
    for (let i = 1; i < rawPolymer.length; i++) {
        polymer[rawPolymer[i-1] + rawPolymer[i]] = polymer[rawPolymer[i-1] + rawPolymer[i]] + 1 || 1 
    }

    for (let step = 1; step <= 40; step++) {
        // console.log(step, answerTransformation(polymer, firstLetter));
        let newPolymer: Record<string, number> = {};
        for (let [key, count] of Object.entries(polymer)) {
            newPolymer[key.charAt(0) + map[key]] = newPolymer[key.charAt(0) + map[key]] + count || count
            newPolymer[map[key] + key.charAt(1)] = newPolymer[map[key] + key.charAt(1)] + count || count
        }
        polymer = newPolymer;
        if (step === 10) {
            part1 = answerTransformation(polymer, firstLetter);
        }
    }
    part2 = answerTransformation(polymer, firstLetter);

    return [part1, part2];
}

function answerTransformation(polymer: Record<string, number>, firstLetter: string): number {
    let counter: Record<string, number> = {}
    counter[firstLetter] = 1;
    for (let cell of Object.entries(polymer)) {
        counter[cell[0].charAt(1)] = counter[cell[0].charAt(1)] + cell[1] || cell[1]
    }
    let sortedCounter = Object.entries(counter).sort((a,b) => a[1] - b[1]);
    return sortedCounter[sortedCounter.length - 1][1] - sortedCounter[0][1];
}