enum Options {
    rock,
    paper,
    scissors
}

const ScoreOutcome = {
    win: 6,
    draw: 3,
    lose: 0
}

const Input = {
    A: Options.rock,
    B: Options.paper,
    C: Options.scissors,
}
const Output = {
    X: Options.rock,
    Y: Options.paper,
    Z: Options.scissors
}
const IntendedOutcome = {
    X: ScoreOutcome.lose,
    Y: ScoreOutcome.draw,
    Z: ScoreOutcome.win,
}

const ShapeOutcome = {
    [Options.rock]: 1,
    [Options.paper]: 2,
    [Options.scissors]: 3,
}


export default function main(rawInput: string): [string|number, string|number] {
    let input = rawInput.split("\n")
    .map(row => row.trim()).map(row => row.split(" ")) as [keyof typeof Input, keyof typeof Output][];


    let part1 = 0;
    let part2 = 0;

    for (let round of input) {
        let elfTurn = Input[round[0]];

        let suggestedPlay = Output[round[1]];
        if (elfTurn === suggestedPlay) {
            part1 += ScoreOutcome.draw;
        } else if ((elfTurn + 1) % 3 === suggestedPlay) {
            part1 += ScoreOutcome.win;
        } // Implicit loss, 0 points
        part1 += ShapeOutcome[suggestedPlay];

        let intended = IntendedOutcome[round[1]];
        let playShape: Options = 0;
        switch (intended) {
            case 0:
                playShape = (elfTurn + 2) % 3;
                break;
            case 3:
                playShape = elfTurn;
                break;
            case 6:
                playShape = (elfTurn + 1) % 3;
                break;
        }
        part2 += intended;
        part2 += ShapeOutcome[playShape];
    }
    return [part1, part2];
}