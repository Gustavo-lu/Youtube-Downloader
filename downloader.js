const path = require("path");
const ytdl = require("ytdl-core");
const fs = require("fs");
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
  return "valido";
}

async function Downloader(data) {
    const linkvalidated = validate(data.url)
  if (linkvalidated === "valido") {
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
        console.log(
          `Video downloaded successfully to ${downloadFolderPath}/${fileName}`
        );
      });
  }else{
    console.log(linkvalidated)
  }
}

module.exports = Downloader;
