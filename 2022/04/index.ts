export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim())
    .map(row => row.split(",").map(section => section.split("-").map(cell => parseInt(cell)))) as [[number, number],[number,number]][];

    let part1 = 0;
    let part2 = 0;

    for (let assignment of input) {
        let upperMin = Math.max(assignment[0][0], assignment[1][0]);
        let lowerMax = Math.min(assignment[0][1], assignment[1][1]);
        if (upperMin <= lowerMax) {
            if (
                (assignment[0][0] === upperMin && assignment[0][1] === lowerMax) ||
                (assignment[1][0] === upperMin && assignment[1][1] === lowerMax)
            ) {
                part1++;
            }
            part2++;
        }
    }
   
    return [part1, part2];
}