import { Atlas, AtlasArea, AtlasTileInfo } from "./atlas.js";

export default function() {
    function characterIsNumber(char) {
        return Number(char) || char === "0";
    }

    function getAreasInLine(line, index) {
        const areas = [];
        let adjacentNumbers = "";

        for(let i = 0; i < line.length; i++) {
            if(characterIsNumber(line[i])) {
                adjacentNumbers += line[i];
            } else {
                if(adjacentNumbers) {
                    areas.push(new AtlasArea(adjacentNumbers, i - adjacentNumbers.length, index, adjacentNumbers.length, 1));
                }
                adjacentNumbers = "";
            }
        }

        if(adjacentNumbers) {
            areas.push(new AtlasArea(adjacentNumbers, line.length - adjacentNumbers.length, index, adjacentNumbers.length, 1));
        }

        return areas;
    }

    function getLandmarksInLine(line, index) {
        const landmarks = [];

        for(let i = 0; i < line.length; i++) {
            if(!characterIsNumber(line[i]) && line[i] !== ".") {
                landmarks.push({ name: line[i], x: i, y: index});
            }
        }

        return landmarks;
    }

    function areaHasAdjacentLandmark(atlas, area) {
        for(let yOffset = -1; yOffset <= area.height; yOffset++) {
            for(let xOffset = -1; xOffset <= area.width; xOffset++) {
                const x = area.x + xOffset;
                const y = area.y + yOffset;
                const tile = atlas.getTileInfo(x, y);
                if(tile.landmark) {
                    return true;
                }
            }
        }

        return false;
    }

    function getGearRatio(x, y, atlas) {
        const adjacentAreas = [];

        for(let yOffset = -1; yOffset <= 1; yOffset++) {
            for(let xOffset = -1; xOffset <= 1; xOffset++) {
                const x2 = x + xOffset;
                const y2 = y + yOffset;
                const tile = atlas.getTileInfo(x2, y2);
                if(tile.area && !adjacentAreas.includes(tile.area)) {
                    adjacentAreas.push(tile.area);
                }
            }
        }

        if(adjacentAreas.length > 1) {
            console.log({ x, y, adjacentAreas })
            return adjacentAreas.map(area => Number(area.name)).reduce((a, b) => a * b);
        } else {
            return 0;
        }
    }

    function printAtlas(atlas, width, height) {
        const atlasElement = $("#atlas");
        atlasElement.html("");

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const tile = atlas.getTileInfo(x, y);
                if(tile.area) {
                    for(let c = 0; c < tile.area.name.length; c++) {
                        const el = $("<span>")
                            .addClass("area")
                            .text(tile.area.name[c])
                            .appendTo(atlasElement);
                        if(areaHasAdjacentLandmark(atlas, tile.area)) {
                            el.addClass("valid");
                        }
                    }
                    x += (tile.area.width - 1);
                } else if(tile.landmark) {
                    $("<span>")
                        .addClass("landmark")
                        .text(tile.landmark.name)
                        .appendTo(atlasElement);
                } else {
                    $("<span>")
                        .text(" ")
                        .appendTo(atlasElement);
                }
            }
            $("<br>").appendTo(atlasElement);
        }
    }

    function printAtlasOverlay(lines) {
        const atlasOverlayElement = $("<div id=\"atlas-overlay\">").appendTo($("#atlas"));
        atlasOverlayElement.html("");
        for(let y = 0; y < lines.length; y++) {
            for(let x = 0; x < lines[y].length; x++) {
                $("<span>")
                    .text(lines[y][x])
                    .appendTo(atlasOverlayElement);
            }
            $("<br>").appendTo(atlasOverlayElement);
        }
    }

    function execute() {
        const atlas = new Atlas();

        const lines = $("#input").val().split("\n").filter(l => l);
        const areas = lines.map(getAreasInLine).flat();
        areas.forEach(area => atlas.addArea(area));
        const landmarks = lines.map(getLandmarksInLine).flat();
        landmarks.forEach(lm => atlas.addLandmark(lm.x, lm.y, lm.name));

        const partNumbers = areas.filter(area => areaHasAdjacentLandmark(atlas, area)).map(area => Number(area.name));

        const sum = partNumbers.reduce((a, b) => a + b);
        $("#output").val(sum);

        const gearRatios = landmarks
            .filter(lm => lm.name === "*")
            .map(lm => getGearRatio(lm.x, lm.y, atlas));

        const gearRatioSum = gearRatios.reduce((a, b) => a + b);
        $("#gear-ratio").val(gearRatioSum);

        //printAtlas(atlas, lines[0].length, lines.length);
        //printAtlasOverlay(lines);
    }

    $("#input").on("change", () => execute());
};