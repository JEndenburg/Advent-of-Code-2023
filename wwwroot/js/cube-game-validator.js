class CubeCount {
    constructor(label, amount) {
        this._label = label;
        this._amount = amount;
    }

    get label() {
        return this._label;
    }

    get amount() {
        return this._amount;
    }

    static parse(string) {
        const valueAndLabel = string.split(" ");
        const value = Number(valueAndLabel[0]);
        const label = valueAndLabel[1];
        return new CubeCount(label, value);
    }
}

class CubeGame {
    constructor(id, sets) {
        this._id = id;
        this._sets = sets;
    }

    get id() {
        return this._id;
    }

    get sets() {
        return this._sets;
    }

    get biggestCubeCounts() {
        const result = {};

        for(const set of this.sets) {
            for(const cubeCount of set) {
                if(!result[cubeCount.label] || result[cubeCount.label] < cubeCount.amount) {
                    result[cubeCount.label] = cubeCount.amount;
                }
            }
        }

        const resultSet = [];

        for(const member in result) {
            resultSet.push(new CubeCount(member, result[member]));
        }

        return resultSet;
    }

    get largestPower() {
        return this.biggestCubeCounts
            .map(cubeCount => cubeCount.amount)
            .reduce((a, b) => a * b);
    }

    static parse(string) {
        const gameIdAndSets = string.split(":");
        const id = Number(gameIdAndSets[0].substring(5));
        const setStrings = gameIdAndSets[1].split(";");
        const sets = setStrings.map(CubeGame.parseSet);

        return new CubeGame(id, sets);
    }

    static parseSet(string) {
        const cubeCountStrings = string.split(",");
        return cubeCountStrings.map(str => CubeCount.parse(str.trim()));
    }
}

class CubeGameValidator {
    constructor() {
    }

    validateGame(game, containedSet) {
        return game.sets.every(set => this.validateSet(set, containedSet));
    }

    validateSet(set, containedSet) {
        return set.every(pickedCubeCount => {
            for(const containedCubeCount of containedSet) {
                if(this._fitsIn(pickedCubeCount, containedCubeCount)) {
                    return true;
                }
            }
            return false;
        });
    }

    _fitsIn(pickedCubeCount, containedCubeCount) {
        if(containedCubeCount.label !== pickedCubeCount.label) {
            return false;
        }

        return pickedCubeCount.amount <= containedCubeCount.amount;
    }
}

export { CubeGameValidator, CubeGame, CubeCount };