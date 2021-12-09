type LetterReference =
    | 'TOP'
    | 'TOP_LEFT'
    | 'TOP_RIGHT'
    | 'MIDDLE'
    | 'BOTTOM_LEFT'
    | 'BOTTOM_RIGHT'
    | 'BOTTOM';
let LetterAll: LetterReference[] = ['TOP', 'TOP_LEFT', 'TOP_RIGHT', 'MIDDLE', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'BOTTOM'];

let letters = "abcdefg".split('');

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim());

    let part1 = 0;
    let part2 = 0;

    let answer = Array.from({length: 10}).fill(0) as number[];

    for (let [rowIndex, row] of input.entries()) {
        let sentences = row.split("|").map(cell => cell.trim());

        let letterMapping: Record<string, LetterReference[]> = {
            a: LetterAll,
            b: LetterAll,
            c: LetterAll,
            d: LetterAll,
            e: LetterAll,
            f: LetterAll,
            g: LetterAll,
        }
        for (let [i, sentence] of sentences.entries()) {
            let words = sentence.split(" ");
            let mappedWords: Array<number|null> = words.map(val => null);
            let counter = 0;
            do {
                for (let [j, word] of words.entries()) {
                    if (mappedWords[j]) continue;
                    switch(word.length) {
                        case 2:
                            letterMapping = filterLetters(word, letterMapping, ["TOP_RIGHT", "BOTTOM_RIGHT"]);
                            mappedWords[j] = 1;
                            break;
                        case 3:
                            letterMapping = filterLetters(word, letterMapping, ["TOP", "TOP_RIGHT", "BOTTOM_RIGHT"]);
                            mappedWords[j] = 7;
                            break;
                        case 4:
                            letterMapping = filterLetters(word, letterMapping, ["TOP_LEFT", "TOP_RIGHT", "MIDDLE", "BOTTOM_RIGHT"]);
                            mappedWords[j] = 4;
                            break;
                        case 5:
                            // length 5 is 2, 3 and 5
                            let leftFound = 0;
                            let rightFound = 0;
                            let topLeftFound = 0;
                            let topLeftMiddleFound = 0;
                            for (let letter of word.split('')) {
                                if (letterMapping[letter].length <= 2 && (letterMapping[letter].indexOf('TOP_LEFT') !== -1 && letterMapping[letter].indexOf('BOTTOM_LEFT') !== -1)) {
                                    leftFound += 1;
                                }
                                if (letterMapping[letter].length <= 2 && (letterMapping[letter].indexOf('TOP_RIGHT') !== -1 || letterMapping[letter].indexOf('BOTTOM_RIGHT') !== -1)) {
                                    rightFound += 1;
                                }
                                if (letterMapping[letter].indexOf('TOP_LEFT') !== -1 && letterMapping[letter].indexOf('MIDDLE') !== -1) {
                                    topLeftMiddleFound += 1;
                                }
                                if (letterMapping[letter].length === 1 && letterMapping[letter].indexOf('TOP_LEFT') !== -1) {
                                    topLeftFound += 1;
                                }
                            }
                            // remove ambigious case 
                            if (leftFound === 1 && rightFound === 1 && topLeftFound === 0) {
                            }
                            // of 2,3 and 5 only 3 sees both right segments
                            else if (rightFound === 2) {
                                mappedWords[j] = 3;
                                letterMapping = filterLetters(word, letterMapping, ["TOP", "TOP_RIGHT", "MIDDLE", "BOTTOM_RIGHT", "BOTTOM"]);
                            } else if (((topLeftMiddleFound === 0 && topLeftFound === 1) || (topLeftMiddleFound === 2)) && rightFound === 1) {
                                mappedWords[j] = 5;
                                letterMapping = filterLetters(word, letterMapping, ["TOP", "TOP_LEFT", "MIDDLE", "BOTTOM_RIGHT", "BOTTOM"]);
                            } else if (topLeftMiddleFound < 2 && rightFound === 1) {
                                mappedWords[j] = 2;
                                letterMapping = filterLetters(word, letterMapping, ["TOP", "TOP_RIGHT", "MIDDLE", "BOTTOM_LEFT", "BOTTOM"]);
                            } else {
                                // console.log(`Cannot resolve ${j} (${word}) due to rightFound = ${rightFound} and topLeftMiddleFound = ${topLeftMiddleFound}`);
                                // console.table(letterMapping);
                            }
                            break;
                        case 6:
                            // length 6 is 0 (missing middle), 6 (missing topright) and 9 (missing bottomleft)
                            let middleFound = 0;
                            let topRightFound = 0;
                            let bottomLeftFound = 0;
                            for (let letter of word.split('')) {
                                middleFound += letterMapping[letter].indexOf("MIDDLE") !== -1 ? 1 : 0;
                                topRightFound += letterMapping[letter].indexOf("TOP_RIGHT") !== -1 ? 1 : 0;
                                bottomLeftFound += letterMapping[letter].indexOf("BOTTOM_LEFT") !== -1 ? 1 : 0;
                            }
                            if (middleFound === 0) {
                                mappedWords[j] = 0;
                            }
                            else if (topRightFound === 0) {
                                mappedWords[j] = 6;
                            }
                            else if (bottomLeftFound === 0) {
                                mappedWords[j] = 9;
                            }
                            break;
                        
                        // 8 provides no intel, as it contains everything
                        case 7:
                            // console.log(`Found a 8 at word ${j} (${word})`);
                            mappedWords[j] = 8;
                        default:
                            // console.log(`Cannot resolve ${j} (${word}) due to unknown length rule`);
                            break;
                    }
                }
                counter++;
            } while (mappedWords.filter(word => word === null).length && counter < 20);
            if (Object.entries(letterMapping).filter(cell => cell[1].length === 0).length > 0) {
                console.log("ALERT: Broke the mapping somewhere", rowIndex);
                console.table(letterMapping);
            }
            if (i === 1 && mappedWords.filter(word => word === null).length === 0) {
                for (let mappedNumber of mappedWords) {
                    answer[mappedNumber!]++;
                }
                let value = mappedWords[0]! * 1000 + mappedWords[1]! * 100 + mappedWords[2]! * 10 + mappedWords[3]!;
                part2 += value;
            } else if (i === 1) {
                console.log("ALERT: Did not run enough iterations");
            }
            // console.log(mappedWords);
        }
        // console.table(letterMapping);
    }
    part1 = answer[1] + answer[4] + answer[7] + answer[8];

    return [part1, part2];
}

function filterLetters(word: string, letterMapping: Record<string, LetterReference[]>, values: LetterReference[]): Record<string, LetterReference[]> {
    let output = {...letterMapping};
    for (let letter of word.split('')) {
        output[letter] = letterMapping[letter].filter(cell => values.indexOf(cell) !== -1);
    }
    for (let letter of letters.filter(letter => word.indexOf(letter) === -1)) {
        output[letter] = letterMapping[letter].filter(cell => values.indexOf(cell) === -1);
    }
    return output;
}