class PageOptions {
    constructor() {
        this.title = "";
        this.layout = "";
        this.onUnload = null;
        this.onLoad = null;
    }
}

class Page {
    constructor(path, filePath, options) {
        this._path = path.toLowerCase();
        this._filePath = filePath;
        this._options = options;
    }

    get path() {
        return this._path;
    }

    get filePath() {
        return this._filePath;
    }

    get options() {
        return this._options;
    }
};

export { Page, PageOptions };