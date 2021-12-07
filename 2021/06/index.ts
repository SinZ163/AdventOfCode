export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split(",")
    .map(row => Number.parseInt(row));

    let part1 = 0;
    let part2 = 0;

    let db: number[] = new Array(9).fill(0);
    for (let cell of input) {
        db[cell] = db[cell] + 1 || 1
    }
    for (let i = 0; i < 256; i++) {
        if (i === 80) {
            part1 = db.reduce((prev, current) => current += prev, 0);
        }
        let newCells = db.shift() || 0;
        db[6] += newCells;
        db.push(newCells);
    }
    part2 = db.reduce((prev, current) => current += prev, 0);
/*
    let db = [input];
    for (let i = 0; i < 256; i++) {
        console.log(i, db.length, db[0].length);
        let newArrays = [];
        for (let j = 0; j < db.length; j++) {
            let array = db[j];
            if (i === 80) {
                part1 = input.length;
            }
            let newCells = [];
            for (let index = 0; index < array.length; index++) {
                if (--array[index] < 0) {
                    array[index] = 6;
                    newCells.push(8);
                }
            }
            if (array.length > 1e8) {
                newArrays.push(newCells);
            } else {
                array = array.concat(newCells);
            }
            db[j] = array;
        }
        db = db.concat(newArrays);        
    }
    part2 = input.length;
*/
    return [part1, part2];
}