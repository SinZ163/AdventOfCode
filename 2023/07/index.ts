//export default async function main(rawInput: string, runCount: number): Promise<[string|number, string|number]> {
export default function main(rawInput: string, runCount: number): [string|number, string|number] {
    let input = rawInput.split("\n");

    let part1 = 0;
    let part2 = 0;

    let p1Ranks = [
        [] as [string,number][], //"basic"
        [] as [string,number][], //"onepair"
        [] as [string,number][], //"twopair"
        [] as [string,number][], //"three"
        [] as [string,number][], //"fullHouse"
        [] as [string,number][], //"four"
        [] as [string,number][], //"five"
    ];
    let p2Ranks = [
        [] as [string,number][], //"basic"
        [] as [string,number][], //"onepair"
        [] as [string,number][], //"twopair"
        [] as [string,number][], //"three"
        [] as [string,number][], //"fullHouse"
        [] as [string,number][], //"four"
        [] as [string,number][], //"five"
    ];

    
    function rankAssigner(bestScore: number, secondBest: number) {
        if (bestScore === 5) {
            return 6;
        } else if (bestScore === 4) {
            return 5;
        } else {
            if (bestScore === 3 && secondBest === 2) {
                return 4;
            } else if (bestScore === 3) {
                return 3;
            } else if (bestScore === 2 && secondBest === 2) {
                return 2;
            } else if (bestScore === 2) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    for (let row of input) {
        let [hand, betStr] = row.split(" ");
        let bet = Number.parseInt(betStr);
        
        let distinctTypes: Record<string, number> = {};
        let bestScore = 0;
        for (let char of hand) {
            if (!distinctTypes[char]) {
                distinctTypes[char] = 1;
            } else {
                distinctTypes[char]++;
            }
            if (distinctTypes[char] >= bestScore) {
                bestScore = distinctTypes[char];
            }
        }
        
        
        let secondBest = bestScore === 5 ? 0 : Object.entries(distinctTypes).sort((a, b) => b[1] - a[1])[1][1];
        let p1Rank = rankAssigner(bestScore, secondBest);
        p1Ranks[p1Rank].push([hand, bet]);

        if (distinctTypes["J"] > 0 && distinctTypes["J"] !== 5) {
            let best = Object.entries(distinctTypes).sort((a, b) => b[1] - a[1])[0];
            let jokerCount = distinctTypes["J"];
            if (best[0] === "J") {
                best = Object.entries(distinctTypes).sort((a, b) => b[1] - a[1])[1];
            }
            bestScore = best[1] + jokerCount;
            distinctTypes["J"] = 0;
            let secondBest = bestScore === 5 ? 0 : Object.entries(distinctTypes).sort((a, b) => b[1] - a[1])[1][1];
            p2Ranks[rankAssigner(bestScore, secondBest)].push([hand,bet]);
        } else {
            p2Ranks[p1Rank].push([hand, bet]);
        }
    }

    let p2Mode = false;

    function charToValue(char: string) {
        switch (char) {
            case "A":
                return 13;
            case "K":
                return 12;
            case "Q": 
                return 11;
            case "T":
                return 9;
        }
        if (p2Mode && char === "J") {
            return -10;
        } else if (char === "J") {
            return 10;
        }
        let val = Number.parseInt(char);
        return val - 1;
    }

    function sortHands(a: [string, number], b: [string, number]): number {
        for (let i = 0; i < a[0].length; i++) {
            let aChar = charToValue(a[0][i]);
            let bChar = charToValue(b[0][i]);
            if (aChar === bChar) {
                continue;
            }
            else {
                return aChar - bChar;
            }
        }
        return 0;
    }

    let rank = 1;
    for (let tier of p1Ranks) {
        for (let hand of tier.sort(sortHands)) {
            part1 += (rank++ * hand[1]);
        }
    }
    
    p2Mode = true;
    rank = 1;
    for (let tier of p2Ranks) {
        for (let hand of tier.sort(sortHands)) {
            part2 += (rank++ * hand[1]);
        }
    }
    return [part1, part2];
}