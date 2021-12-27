export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trim());

    // console.log(input[0].length);

    let algorithm = input[0].split('').map(cell => cell === "#");

    let part1 = 0;
    let part2 = 0;

    let image: boolean[][] = [];

    for (let [i,row] of input.entries()) {
        if (i === 0) continue;
        if (row.length === 0) continue;
        image.push(row.split('').map(val => val === "#"));
    }
    // console.log(image);
    let newImage : boolean[][] = image;
    for (let i of new Array(50).keys()) {
        newImage = enhance(algorithm, newImage, i);
        if (i === 1)
            part1 = newImage.reduce((prevRow, currentRow) => prevRow + currentRow.reduce((prevCell, currentCell) => prevCell + (currentCell ? 1 : 0), 0), 0);
    }
    // console.log(newImage);
    part2 = newImage.reduce((prevRow, currentRow) => prevRow + currentRow.reduce((prevCell, currentCell) => prevCell + (currentCell ? 1 : 0), 0), 0);

    return [part1, part2];
}
function enhance(algorithm: boolean[], image: boolean[][], iteration: number) : boolean[][] {
    let newImage: boolean[][] = [];

    let width = image[0].length;

    let nullCell = (iteration % 2 === 1 && algorithm[0]) ? 1 : 0;
    // console.log(iteration, nullCell);

    let spread = 1;
    for (let y = spread*-1; y < width + spread; y++) {
        newImage.push([]);
        for (let x = spread*-1; x < width + spread; x++) {
            // console.log(y, x);
            let coords = new Array(9).fill(nullCell);
            // console.log(coords);
            if (y > 0 && y <= width && x > 0 && x <= width) coords[0] = image[y - 1][x-1] ? 1 : 0;
            if (y > 0 && y <= width && x > -1 && x < width) coords[1] = image[y - 1][x] ? 1 : 0;
            if (y > 0 && y <= width && x < width-1) coords[2] = image[y - 1][x+1] ? 1 : 0;

            if (y > -1 && y < width && x > 0 && x <= width) coords[3] = image[y][x-1] ? 1 : 0;
            if (y > -1 && y < width && x > -1 && x < width) coords[4] = image[y][x] ? 1 : 0;
            if (y > -1 && y < width && x < width-1) coords[5] = image[y][x+1] ? 1 : 0;

            if (y > -2 && y < width-1 && x > 0 && x <= width) coords[6] = image[y+1][x-1] ? 1 : 0;
            if (y > -2 && y < width-1 && x > -1 && x < width) coords[7] = image[y+1][x] ? 1 : 0;
            if (y > -2 && y < width-1 && x < width-1) coords[8] = image[y+1][x+1] ? 1 : 0;

            newImage[newImage.length-1].push(algorithm[Number.parseInt(coords.join(''), 2)]);
        }
    }
    return newImage;
}