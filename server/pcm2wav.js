const fs = require('fs');
const wav = require('wav');

// 读取PCM文件
const pcmData = fs.readFileSync('./test.pcm');

// 设置WAV格式
const writer = new wav.FileWriter('audio.wav', {
  channels: 2,
  sampleRate: 11025,
  bitDepth: 16
});

// 将PCM数据写入WAV文件
writer.write(pcmData);

// 完成转换
writer.end(() => {
  console.log('PCM to WAV conversion complete.');
});