import { Page } from "./page.js";
import Router from "./router.js";
import RunDay1 from "./day1.js";
import RunDay2 from "./day2.js";

(function() {
    const pages = [
        new Page("/", "./pages/index.html", { title: "Index" }),
        new Page("/day1", "./pages/day1.html", { title: "Day 1", onLoad: RunDay1 }),
        new Page("/day2", "./pages/day2.html", { title: "Day 2", onLoad: RunDay2 }),
    ];

    window.app = {
        router: new Router(pages,
            "./layouts/default.html",
            "./pages/error.html"),
    };

    app.router.navigateTo("/");
})();