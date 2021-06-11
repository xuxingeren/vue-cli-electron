import { app, ipcMain, dialog } from "electron";
import path from "path";

export default function(win) {
  ipcMain.handle("start-download", (event, data) => {
    if (win.webContents.session.download) {
      if (win.webContents.session.download[data.downloadUrl]) {
        return;
      }
      win.webContents.session.download[data.downloadUrl] = data;
    } else {
      win.webContents.session.download = {};
      win.webContents.session.download[data.downloadUrl] = data;
    }
    win.webContents.session.download[data.downloadUrl] = data;
    win.webContents.downloadURL(data.downloadUrl);
  });
  win.webContents.session.on("will-download", (event, item, webContents) => {
    const download = event.sender.download;
    if (download) {
      const filePath = path.join(
        download[item.getURL()].filePath || app.getPath("downloads"),
        download[item.getURL()].folder,
        item.getFilename()
      );
      // 自动保存
      item.setSavePath(filePath);
      // 下载进度
      item.on("updated", (event, state) => {
        switch (state) {
          case "progressing":
            webContents.send(
              "download-progress",
              ((item.getReceivedBytes() / item.getTotalBytes()) * 100).toFixed(
                0
              )
            );
            break;
          case "interrupted ":
            webContents.send("download-paused", true);
            break;
          default:
            break;
        }
      });
      // 下载完成或失败
      item.once("done", (event, state) => {
        switch (state) {
          case "completed":
            const data = {
              filePath,
              downloadInfo: download[item.getURL()],
            };
            delete webContents.session.download[item.getURL()];
            webContents.send("download-done", data);
            break;
          case "interrupted":
            delete webContents.session.download[item.getURL()];
            webContents.send("download-error", true);
            dialog.showErrorBox(
              "下载出错",
              "由于网络或其他未知原因导致下载出错"
            );
            break;
          default:
            break;
        }
      });
    }
  });
}
