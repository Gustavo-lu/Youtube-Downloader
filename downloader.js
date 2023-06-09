const path = require("path");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { shell } = require("electron");

const notifier = require("node-notifier");

function getDownloadFolderPath() {
  let downloadFolderPath;
  if (process.platform === "win32") {
    downloadFolderPath = path.join(process.env.USERPROFILE, "Downloads");
  } else if (process.platform === "darwin") {
    downloadFolderPath = path.join(process.env.HOME, "Downloads");
  } else {
    downloadFolderPath = path.join(process.env.HOME, "Downloads");
  }
  return downloadFolderPath;
}

function validate(link) {
  if (typeof link !== "string") {
    return "O link deve ser uma string";
  }
  if (!link.match(/^https?:\/\//)) {
    return "O link deve começar com http:// ou https://";
  }
  if (!link.match(/^https?:\/\/[A-Za-z0-9\-\.]+[A-Za-z]{2,}\S*/)) {
    return "O link não tem um domínio válido";
  }
  return "pass";
}

async function Downloader(data) {
  const linkvalidated = validate(data.url);
  if (linkvalidated === "pass") {
    const downloadFolderPath = getDownloadFolderPath();
    const videoInfo = await ytdl.getInfo(data.url);
    const videoTitle = videoInfo.videoDetails.title;
    let videoFormat;
    if (data.format === "MP3") {
      videoFormat = ytdl.chooseFormat(videoInfo.formats, {
        filter: "audioonly",
      });
    } else {
      videoFormat = ytdl.chooseFormat(videoInfo.formats, {
        quality: "highest",
      });
    }

    const videoFileExtension = videoFormat.container;
    const fileName = `${videoTitle}.${videoFileExtension}`;
    const videoStream = ytdl(data.url, { quality: "highest" }).on(
      "error",
      (err) => {
        console.log("Error downloading video:", err);
      }
    );

    videoStream
      .pipe(fs.createWriteStream(path.join(downloadFolderPath, fileName)))
      .on("finish", () => {
        notifier.notify(
          {
            appID: "YouTubeDownloader",
            title: "Arquivo salvo",
            message: "Seu arquivo foi salvo com sucesso!",
            icon: path.join(__dirname, "/public/assets/YouTubeico.png"),
            sound: true,
            wait: true,
            backgroundColor: "#1c1917",
            timeout: 5,
          },
          (err, response, metadata) => {
            if (response === "activate") {
              shell.openPath(`${downloadFolderPath}/${fileName}`);
            }
          }
        );
      });
  } else {
    notifier.notify({
      appID: "YouTubeDownloader",
      title: "Erro ao tentar efetuar o download",
      message: linkvalidated,
      icon: path.join(__dirname, "/public/assets/YouTubeico.png"),
      sound: true,
      wait: true,
      backgroundColor: "#1c1917",
      timeout: 2,
    });
  }
}

module.exports = Downloader;
