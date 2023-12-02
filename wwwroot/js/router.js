import { Page } from "./page.js";

export default class Router {
    constructor(pages, defaultLayout, errorPage) {
        this._pages = pages;
        this._defaultLayout = defaultLayout;
        this._errorPage = errorPage;

        this._currentPage = null;
        this._scriptElement = null;
        this._observeDOMForAnchors();
    }

    async navigateTo(url) {
        const path = this._tryParseUrlAsRelativePath(url);
        if(path === undefined) {
            return false;
        }
        const page = this._getPageForPath(path);

        if(!page) {
            page = {
                filePath: this._errorPage
            };
        }

        if(this._currentPage?.options?.onUnload) {
            this._currentPage.options.onUnload();
        }

        if(!this._currentPage || this._currentPage.options?.layout !== page.options?.layout) {
            $("#app").html(null);
        } else {
            $("#page-content").html(null);
        }

        document.title = page.options?.title ?? page.path;

        await this._loadLayout(page);
        await this._loadPageContent(page);

        if(page.options?.onLoad) {
            page.options.onLoad();
        }

        this._currentPage = page;
        return true;
    }

    _tryParseUrlAsRelativePath(url) {
        if(url.startsWith(location.origin)) {
            return url.substring(location.origin.length).toLowerCase();
        }

        if(url.startsWith("/")) {
            return url;
        }

        return undefined;
    }

    _getPageForPath(path) {
        return this._pages.find(page => page.path === path);
    }

    async _loadLayout(page) {
        const layoutPath = page.options?.layout ?? this._defaultLayout;
        const response = await fetch(layoutPath);
        const html = await response.text();
        $("#app").html(html);
    }

    async _loadPageContent(page) {
        const filePath = page.filePath;
        const response = await fetch(filePath);
        const html = await response.text();
        $("#page-content").html(html);
    }

    _observeDOMForAnchors() {
        const router = this;
        const options = {
            childList: true,
            subtree: true
        };
        this._anchorObserver = new MutationObserver((mutations, observer) => {
            $("a").click(function(event) {
                event.preventDefault();
                router.navigateTo($(this).attr("href"));
            });
        });
        this._anchorObserver.observe(document.getElementById("app"), options);
    }
};