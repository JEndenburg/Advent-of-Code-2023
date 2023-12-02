export default class TrebuchetCalibrationRecoverer {
    constructor() {
        this._numberWords = [
            { word: "one", value: 1 },
            { word: "two", value: 2 },
            { word: "three", value: 3 },
            { word: "four", value: 4 },
            { word: "five", value: 5 },
            { word: "six", value: 6 },
            { word: "seven", value: 7 },
            { word: "eight", value: 8 },
            { word: "nine", value: 9 }
        ];
    }

    recoverDocument(contents, includeSpelledOutNumbers) {
        const lines = contents.split("\n");
        const numbers = lines.map(line => this._getNumbersFromLine(line, includeSpelledOutNumbers));
        return numbers.reduce((a, b) => a + b);
    }

    _getNumbersFromLine(line, includeSpelledOutNumbers) {
        if(!line) {
            return 0;
        }

        const characters = line.split("");
        const numbers = this._findNumbers(characters, includeSpelledOutNumbers);

        if(numbers.length === 0) {
            return 0;
        }

        const firstNumber = numbers[0];
        const lastNumber = numbers[numbers.length - 1];

        return Number(firstNumber.toString().concat(lastNumber));
    }

    _findNumbers(characters, includeWords) {
        const numbers = [];
        let readStringCandidate = "";

        for(let i = 0; i < characters.length; i++) {
            if(includeWords) {
                const result = this._findNumberInWord(characters, i);

                if(result) {
                    numbers.push(result);
                    continue;
                }
            }

            const numberValue = Number(characters[i]);
            if(numberValue) {
                numbers.push(numberValue);
            }
        }

        return numbers;
    }

    _findNumberInWord(characters, startIndex) {
        let index = startIndex;
        let readStringCandidate = characters[index];
        while(this._numberWords.some(word => word.word.startsWith(readStringCandidate))) {
            const match = this._numberWords.find(word => word.word === readStringCandidate);

            if(match) {
                return match.value;
            } else {
                readStringCandidate += characters[++index];
            }
        }

        return null;
    }
}