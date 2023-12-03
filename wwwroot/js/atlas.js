class AtlasArea {
    constructor(name, x, y, w, h) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

    get name() {
        return this._name;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._w;
    }

    get height() {
        return this._h;
    }

    contains(x, y) {
        return x >= this.x
            && x < (this.x + this.width)
            && y >= this.y
            && y < (this.y + this.height);
    }
}

class Atlas {
    constructor() {
        this._areas = [];
        this._landmarks = [];
    }

    get areas() {
        return this._areas;
    }

    addArea(area) {
        for(let y = area.y; y < area.y + area.height; y++) {
            for(let x = area.x; x < area.x + area.width; x++) {
                const tileInfo = this.getTileInfo(x, y);
                if(tileInfo.area || tileInfo.landmark) {
                    throw new Error(`Position '${x},${y}' is already occupied.`);
                }
            }
        }

        this._areas.push(area);
    }

    addLandmark(x, y, name) {
        const tileInfo = this.getTileInfo(x, y);
        if(tileInfo.area || tileInfo.landmark) {
            throw new Error(`Position '${x},${y}' is already occupied.`);
        }

        this._landmarks.push({ x, y, name });
    }

    getTileInfo(x, y) {
        const landmark = this._landmarks.find(l => l.x === x && l.y === y);
        if(landmark) {
            return new AtlasTileInfo(x, y, null, landmark);
        }

        const area = this._areas.find(a => a.contains(x, y));
        if(area) {
            return new AtlasTileInfo(x, y, area, null);
        }

        return new AtlasTileInfo(x, y, null, null);
    }
}

class AtlasTileInfo {
    constructor(x, y, area, landmark) {
        this._x = x;
        this._y = y;
        this._area = area;
        this._landmark = landmark;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get area() {
        return this._area;
    }

    get landmark() {
        return this._landmark;
    }
}

export { Atlas, AtlasArea, AtlasTileInfo };