export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim().split('').filter(cell => cell !== '#')).filter(row => row.length);
    
    console.log(input);

    let part1 = 0;
    let part2 = 0;

    const cost = {
        A: 1,
        B: 10,
        C: 100,
        D: 1000
    }

    return [part1, part2];
}