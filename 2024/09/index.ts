//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number|bigint, string|number|bigint] {
    let input = rawInput.trimEnd().split("").map(Number);
    console.log("Input:",input);

    let file = [];
    let maxId = 0;
    for (let [i, val] of input.entries()) {
        if (i % 2 === 1) {
            file.push(...Array(val).fill('.'));
        } else {
            let id = i / 2;
            file.push(...Array(val).fill(id));
            maxId = id;
        }
    };
    let p2File = [...file];
    let lastIndex = 0;
    do {
        let firstGap = file.indexOf('.', lastIndex);
        if (firstGap === -1) break;
        let lastVal;
        do {
            lastVal = file.pop();
        } while (lastVal === ".");
        if (firstGap > file.length) {
            file.push(lastVal);
            break;
        }
        file[firstGap] = lastVal;
    } while(true);
    //console.log(file);

    do {
        let lastIndex = p2File.lastIndexOf(maxId);
        let firstIndex = p2File.indexOf(maxId);
        let firstGap = p2File.indexOf(".");
        if (firstGap === -1 || firstIndex < firstGap) continue;
        let length = lastIndex - firstIndex + 1;
        let index = -1;
        let count = 0;
        for (let [i,char] of p2File.entries()) {
            if (char === '.') {
                if (index === -1) {
                    index = i;
                }
                count++;
            } else {
                index = -1;
                count = 0;
            }
            if (count === length) break;
        }
        if (count !== length) continue;
        if (index > firstIndex) continue;
        //console.log(p2File, maxId, length, index);
        const data = p2File.splice(firstIndex, length, ...Array(length).fill('.'));
        //console.log(data);
        p2File.splice(index, length, ...data);
        //console.log(p2File);
        //break;
    } while (maxId-- > 0);
    console.log(p2File);

    function calcChecksum(file: any[]) {
        let checksum = 0;
        for (let [i,val] of file.entries()) {
            if (val === '.') continue;
            checksum += i * val;
        }
        return checksum;
    }

    let part1 = calcChecksum(file);
    let part2 = calcChecksum(p2File);

    return [part1, part2];
}