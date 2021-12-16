export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split('');
    let part1 = 0;
    let part2 = 0;

    let bytes: Array<0|1> = [];
    for (let [i, char] of input.entries()) {
        let newBits = Number.parseInt(char, 16).toString(2).split('').map(val => Number.parseInt(val)) as Array<0|1>;
        while (newBits.length < 4) {
            newBits = [0, ...newBits];
        }
        bytes.push(...newBits);
    }
    let output = readPacket(bytes);

    part1 = output.versions.reduce((prev, current) => current + prev, 0);
    part2 = output.result;

    return [part1, part2];
}

type PacketType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Output {
    bytes: Array<0|1>,
    versions: number[],
    packetType: PacketType,
    result: number
}

function readPacket(bytes: Array<0|1>): Output {
    let versions = [];

    let versionBytes = bytes.splice(0, 3);
    let version = (versionBytes[0] << 2) + (versionBytes[1] << 1) + versionBytes[2]
    versions.push(version);

    let packetBytes = bytes.splice(0, 3);
    let packetType = (packetBytes[0] << 2) + (packetBytes[1] << 1) + packetBytes[2] as PacketType

    let result: number = -1;
    
    if (packetType === 4) {
        let payload = [];
        while(true) {
            let continueBit = bytes.splice(0, 1)[0];
            payload.push(...bytes.splice(0, 4));
            if (continueBit === 0) {
                break;
            }
        }
        result = Number.parseInt(payload.join(''), 2);
    } else {
        let operatorMode = bytes.splice(0, 1)[0];
        let outputs: number[] = [];
        if (operatorMode === 0) {
            let length = Number.parseInt(bytes.splice(0, 15).join(''), 2);
            let subsection = bytes.splice(0, length);
            while (subsection.length > 0) {
                let output = readPacket(subsection);
                subsection = output.bytes;
                outputs.push(output.result);
                versions.push(...output.versions);
            }
        } else {
            let length = Number.parseInt(bytes.splice(0, 11).join(''), 2);
            while (length-- > 0) {
                let output = readPacket(bytes);
                outputs.push(output.result);
                versions.push(...output.versions);
            }
        }
        switch(packetType) {
            case 0:
                result = outputs.reduce((prev, current) => prev + current, 0);
                break;
            case 1:
                result = outputs.reduce((prev, current) => prev * current, 1);
                break;
            case 2:
                result = Math.min(...outputs);
                break;
            case 3:
                result = Math.max(...outputs);
                break;
            // 4 is already done
            case 5:
                result = outputs[0] > outputs[1] ? 1: 0;
                break;
            case 6:
                result = outputs[0] < outputs[1] ? 1: 0;
                break;
            case 7:
                result = outputs[0] === outputs[1] ? 1: 0;
                break;
        }
    }
    return {bytes, versions, packetType, result};
}