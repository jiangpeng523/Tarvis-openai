const fs = require('fs');
const log = require('log4node');
const wav = require('wav');

const tranform = () => {
  // 读取PCM文件
  const pcmData = fs.readFileSync('./test.pcm');

  const audioFileName = `audio-${Date.now()}.wav`

  // 设置WAV格式
  const writer = new wav.FileWriter(`./public/audios/${audioFileName}`, {
    channels: 2,
    sampleRate: 11025,
    bitDepth: 16
  });

  // 将PCM数据写入WAV文件
  writer.write(pcmData);
  return new Promise((resolve) => {
    // 完成转换
    writer.end(() => {
      log.info('PCM to WAV conversion complete.');
      resolve(audioFileName);
    });
  })
};

module.exports = {
  tranform
};