//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    function Recursive(numbers: number[]) {
        let output = [];
        for (let i = 1; i < numbers.length; i++) {
            output.push(numbers[i] - numbers[i - 1]);
        }
        return output;
    }

    for (let row of input) {
        let numbers = row.split(" ").map(val => Number.parseInt(val));

        let numberHistory = [numbers];

        do {
            numbers = Recursive(numbers);
            numberHistory.push(numbers);
        } while (numbers.some(val => val != 0));
        //console.log(numberHistory);

        for (let row of numberHistory) {
            part1 += row[row.length - 1];
        }
        let val = 0;
        for (let row of numberHistory.reverse()) {
            val = row[0] - val;
        }
        part2 += val;
        // console.log(val, part2);
    }

    return [part1, part2];
}