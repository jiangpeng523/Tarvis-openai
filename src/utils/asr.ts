import axios from 'axios';
import CryptoJS from 'crypto-js';

const appId = '9bef68ff';
const apiKey = 'a865e13fbc0a39f82921e443fa42154e';
const apiSecret = 'OGVkYTJmZDZkMDNiY2JmYjA1NGM0NTg3';
// 科大讯飞的 API 地址
const apiUrl = "http://api.xfyun.cn/v1/service/v1/iat";
const language = "zh_cn";
// 音频编码方式（支持的编码方式：pcm、wav、opus、speex）
const codec = "pcm";
// 是否使用标点
const punctuation = 1;

// 获取当前时间戳
const ts = Math.floor(Date.now() / 1000);

//生成签名所需的原始字符串
const raw = `appid=${appId}&ts=${ts}`;

// 使用 API Key 对原始字符串进行 HmacSHA1 加密生成签名
const signature = CryptoJS.HmacSHA1(raw, apiKey).toString(CryptoJS.enc.Base64);



// 构造 HTTP POST 请求的 header
const headers = {
  "Content-Type": "application/json",
  "X-Appid": appId,
  "X-CurTime": String(ts),
  "X-Param": encodeURI(`{"auf":"${codec}","aue":"raw","scene":"main"}`),
  "X-CheckSum": signature,
};



export default async (data: Blob) => {
  //读取音频文件
  const audioBuffer = await data.arrayBuffer();

  // 进行 Base64 编码
  const audioBase64 = audioBuffer.toString("base64");

  // 构造 HTTP POST 请求的 body
  const body = {
    common: {
      app_id: appId,
    },
    business: {
      language,
      domain: "iat",
      accent: "mandarin",
      vad_eos: 5000,
      dwa: "wpgs",
      pd: punctuation,
      audio_format: codec,
    },
    data: {
      status: 2,
      encoding: "base64",
      audio: audioBase64,
    },
  };


  // 发送 HTTP POST 请求并处理响应
  axios
    .post(apiUrl, body, { headers })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};