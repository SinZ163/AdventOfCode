//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number|bigint, string|number|bigint] {
    let input = rawInput.split("\n");

    let part1 = BigInt(0);
    let part2 = BigInt(0);
    
    for (let row of input) {
        const [answerStr, cells] = row.split(": ");
        const answer = BigInt(answerStr);
        const numbers = cells.split(" ").map(BigInt);
        
        function test(remainingNumbers: bigint[], p2Only: boolean): [boolean, boolean] {
            //console.log(answer, remainingNumbers, operators);
            let number1 = remainingNumbers.shift();
            let number2 = remainingNumbers.shift();
            if (number1 === undefined || number2 === undefined) {
                if (number1 === answer) {
                    return [true, p2Only];
                } else {
                    return [false, p2Only];
                }
            }
            if (number1 > answer) {
                return [false, p2Only];
            }
            const mulTest = test([number1*number2, ...remainingNumbers], p2Only);
            if (mulTest[0]) {
                return mulTest;
            }
            const posTest = test([number1+number2, ...remainingNumbers], p2Only); 
            if (posTest[0]) {
                return posTest;
            }
            return test([BigInt(number1.toString()+number2.toString()), ...remainingNumbers], true);
        }
        const fullTest = test(numbers, false);
        if (fullTest[0]) {
            if (!fullTest[1])
                part1 += answer;
            part2 += answer;
        }
    }
    return [part1, part2];
}