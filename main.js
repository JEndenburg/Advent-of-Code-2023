const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const window = new BrowserWindow({
        show: false,
    });
    window.setMenu(null);
    window.maximize();
    window.webContents.openDevTools();
    window.loadFile("wwwroot/index.html");
    window.show();
    return window;
};

app.whenReady().then(() => {
    const window = createWindow();
});