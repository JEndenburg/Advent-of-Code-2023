import { CubeGameValidator, CubeGame, CubeCount } from "./cube-game-validator.js";

export default function() {
    function execute() {
        const gameStrings = $("#input").val().split("\n").filter(str => str);
        const games = gameStrings.map(CubeGame.parse);
        const validator = new CubeGameValidator();
        const containedSet = [
            new CubeCount("red", $("#red-count").val()),
            new CubeCount("green", $("#green-count").val()),
            new CubeCount("blue", $("#blue-count").val()),
        ];
        const validGames = games.filter(game => validator.validateGame(game, containedSet));
        const idSum = validGames
            .map(game => game.id)
            .reduce((a, b) => a + b);
        $("#output").val(idSum);
        const powerSum = games
            .map(game => game.largestPower)
            .reduce((a, b) => a + b);
        $("#power").val(powerSum);

        const validationResults = $("#validation-result tbody");
        validationResults.html("");
        for(const game of games) {
            const row = $("<tr>")
                .addClass(validGames.includes(game) ? "valid" : "invalid")
                .appendTo(validationResults);

            $("<td>")
                .text(game.id)
                .appendTo(row);

            $("<td>")
                .text(game.sets[0].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", "))
                .appendTo(row);

            $("<td>")
                .text(game.sets[1].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", "))
                .appendTo(row);

            $("<td>")
                .text(game.sets[2].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", "))
                .appendTo(row);

            $("<td>")
                .text(game.sets.length >= 4 ? game.sets[3].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", ") : "N/A")
                .appendTo(row);

            $("<td>")
                .text(game.sets.length >= 5 ? game.sets[4].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", ") : "N/A")
                .appendTo(row);

            $("<td>")
                .text(game.sets.length >= 6 ? game.sets[5].map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", ") : "N/A")
                .appendTo(row);

            $("<td>")
                .text(validGames.includes(game).toString())
                .appendTo(row);

            $("<td>")
                .text(game.biggestCubeCounts.map(cubeCount => `${cubeCount.amount} ${cubeCount.label}`).join(", "))
                .appendTo(row);

            $("<td>")
                .text(game.largestPower)
                .appendTo(row);
        }
    }

    $("#input").on("change", () => execute());
    $("#red-count").on("change", () => execute());
    $("#blue-count").on("change", () => execute());
    $("#green-count").on("change", () => execute());
};