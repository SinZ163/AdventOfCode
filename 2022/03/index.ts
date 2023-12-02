export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim());

    let part1 = 0;
    let part2 = 0;

    let groupRows = [];
    for (let row of input) {
        let firstHalf = row.substring(0, row.length / 2);
        let secondHalf = row.substring(row.length / 2);
        let repeats = new Set<string>();
        for (let letter of firstHalf) {
            if (secondHalf.indexOf(letter) > -1) {
                repeats.add(letter);
            }
        }
        for (let repeat of repeats) {
            //console.log(repeat, firstHalf, secondHalf);
            let code = repeat.charCodeAt(0);
            part1 += (code % 32) 
            if (code < 94) {
                part1 += 26;
            }
            //console.log(part1, (code % 32) + (code < 94 ? 26 : 0));
        }
        groupRows.push(row);
        if (groupRows.length === 3) {
            // Do Group logic here
            for (let letter of groupRows[0]) {
                if (groupRows[1].indexOf(letter) > -1) {
                    if (groupRows[2].indexOf(letter) > -1) {
                        let code = letter.charCodeAt(0);
                        //console.log("part2", letter);
                        part2 += (code % 32) + (code < 94 ? 26 : 0);
                        break;
                    }
                }
            }

            groupRows.length = 0;
        }
    }


   
    return [part1, part2];
}