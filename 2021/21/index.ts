export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim().match(/Player (\d) starting position: (\d+)/));

    let part1 = 0;
    let part2 = 0;

    let players = [];
    for (let player of input) {
        if (!player) continue;
        players.push({
            id: Number.parseInt(player[1]),
            position: Number.parseInt(player[2]),
            score: 0,
        });
    }

    console.log(players);

    let dice = 1;
    let timesRolled = 0;
    let winner = 0;
    while(true) {
        for (let i = 0; i < players.length; i++) {
            if (winner) break;
            let player = players[i];
            for (let j of [0, 1, 2]) {
                player.position += dice++;
                if (player.position > 10) {
                    player.position = player.position % 10;
                }
                if (dice > 100) {
                    console.log(players, dice, timesRolled);
                    dice = 1;
                }
                timesRolled++;
                if (timesRolled === 993) {
                    console.log(players, dice, timesRolled);
                }
            }
            player.score += player.position;
            if (player.score >= 1000) {
                winner = player.id;
                break;
            }
        }
        if (winner) break;
    }
    console.log(players, dice, timesRolled);

    return [part1, part2];
}