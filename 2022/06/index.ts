export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.trim();

    let part1 = 0;
    let part2 = 0;

    let i = 4;
    while (i < input.length) {
        let p1segment = input.substring(i-4, i);
        //console.log(segment);
        let p1set = new Set<string>();
        for (let letter of p1segment) {
            p1set.add(letter);
        }
        if (p1set.size === 4 && part1 === 0) {
            part1 = i;
        }

        if (i >= 14) {
            let p2segment = input.substring(i-14, i);
            // console.log(p2segment);
            let p2set = new Set<string>();
            for (let letter of p2segment) {
                p2set.add(letter);
            }
            if (p2set.size === 14 && part2 === 0) {
                part2 = i;
            }
        }
        if (part1 !== 0 && part2 !== 0) {
            break;
        }
        i++;
    }

   
    return [part1, part2];
}