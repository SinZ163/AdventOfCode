interface File {
    type: "file";
    name: string;
    size: number;
}
interface Directory {
    type: "directory";
    name: string;
    files: Entry[];
    size: number;
}
type Entry = Directory|File;

function computeSize(fileStructure: Directory) {
    let size = 0;
    for (let entry of fileStructure.files) {
        if (entry.type === "file") {
            size += entry.size;
        } else {
            size += computeSize(entry);
        }
    }
    fileStructure.size = size;
    return size;
}

function computePart(fileStructure: Directory, part1: number, freeSpace: number, smallestDirectory: Directory|undefined) {
    for (let file of fileStructure.files) {
        if (file.type !== "directory") continue;
        if (file.size < 100000) {
            part1 += file.size;
        }
        if (file.size >= freeSpace && (!smallestDirectory || (file.size < smallestDirectory.size))) {
            smallestDirectory = file;
        }
        [part1, smallestDirectory] = computePart(file, part1, freeSpace, smallestDirectory);
    }
    return [part1, smallestDirectory] as [number, Directory|undefined];
}

export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n").map(row => row.trim());

    let part1 = 0;
    let part2 = 0;

    let location: string[] = [];

    let fileStructure: Directory = {
        type: "directory",
        name: "/",
        files: [],
        size: -1
    };

    let parseMode = "";
    for (let line of input) {
        //console.log(line);
        if (line.startsWith("$")) {
            // remove prefix
            line = line.substring(2);

            //console.log(line);
            if (line.startsWith("cd")) {
                line = line.substring(3);
                //console.log(line);
                if (line === "/") {
                    location.length = 0;
                }
                else if (line === "..") {
                    location.pop();
                } else {
                    location.push(line);
                }
            } else if (line.startsWith("ls")) {
                parseMode = "ls";
            }
        } else {
            if (parseMode === "ls") {
                let currentFolder = fileStructure.files;
                for (let head of location) {
                    let entry = currentFolder.find(file => file.name === head);
                    if (!entry || entry.type !== "directory") {
                        console.warn("WTF", head, "is missing in ", currentFolder, location);
                        break;
                    }
                    currentFolder = entry.files;
                }
                //console.log("L56", currentFolder, location);
                if (line.startsWith("dir")) {
                    currentFolder.push({type: "directory", name: line.substring(4), files: [], size: -1});
                } else {
                    let lineInfo = line.split(" ")
                    let size = Number.parseInt(lineInfo.shift()!);
                    let name = lineInfo.join(" ");
                    currentFolder.push({type: "file", name, size});
                }
            }
        }
    }
    computeSize(fileStructure);
    //console.log(JSON.stringify(fileStructure, undefined, 4));

    const TOTAL_SIZE = 70000000;
    let freeSpace = TOTAL_SIZE - fileStructure.size;
    const TARGET_SIZE = 30000000;
    let spaceToDelete = TARGET_SIZE - freeSpace;
    console.table({TOTAL_SIZE, fileStructuresize: fileStructure.size, freeSpace, TARGET_SIZE, spaceToDelete});
    if (spaceToDelete < 0) {
        console.warn("wtf?");
    }

    let [part1Answer, smallDirectory] = computePart(fileStructure, 0, spaceToDelete, undefined);
    part1 = part1Answer;
    part2 = smallDirectory?.size || -1;
   
    return [part1, part2];
}
// part2 not 997631 