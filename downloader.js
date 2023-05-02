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
  
  async function Downloader(data) {
    const downloadFolderPath = getDownloadFolderPath();
    const videoInfo = await ytdl.getInfo(data.url);
    const videoTitle = videoInfo.videoDetails.title;
    let videoFormat;
  
    if (data.format === 'MP3') {
      videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });
    } else {
      videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
    }
  
    const videoFileExtension = videoFormat.container;
    const fileName = `${videoTitle}.${videoFileExtension}`;
    const videoStream = ytdl(data.url, { quality: 'highest' }).on('error', (err) => {
      console.log('Error downloading video:', err);
    });
  
    videoStream.pipe(fs.createWriteStream(path.join(downloadFolderPath, fileName))).on('finish', () => {
      console.log(`Video downloaded successfully to ${downloadFolderPath}/${fileName}`);
    });
  }
  


module.exports= Downloader;
  