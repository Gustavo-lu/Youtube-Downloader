const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Downloader = require("./downloader");
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: __dirname + "/public/assets/YouTubeico.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("./public/index.html");
  win.setMenuBarVisibility(false);
}
ipcMain.on("data", (event, arg) => {
  Downloader(arg);
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
