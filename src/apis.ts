import axios, { AxiosRequestConfig } from "axios";

// import * as CryptoJS from 'crypto-js';

// // 百度API的地址和参数
// const apiUrl = 'http://vop.baidu.com/server_api';
// const appId = 'your_app_id'; // 替换为实际的 app_id
// const secret = 'your_secret'; // 替换为实际的 secret
// const devPid = 1536; // 固定值，表示普通话

// // 准备需要转换的音频文件数据
// const audioData: ArrayBuffer = ...; //从本地或网络获取

// // 计算数字签名
// const timestamp = Math.floor(Date.now() / 1000); // 精确到秒
// const sign = CryptoJS.MD5(`${appId}${timestamp}${secret}`).toString();

// // 构造请求参数
// const params = {
//   format: 'pcm',
//   rate: 16000,
//   channel: 1,
//   token: 'dummy',
//   cuid: 'dummy',
//   lan: 'zh',
//   dev_pid: devPid,
//   speech: audioData,
//   len: audioData.byteLength,
//   // 下面是数字签名和时间戳
//   appid: appId,
//   sig: sign,
//   time: timestamp,
// };

// // 发送API请求
// axios.post(apiUrl, params, {
//   headers: { 'Content-Type': 'audio/pcm;rate=16000' },
// }).then((response) => {
//   console.log(response.data.result); // 输出转换后的文字结果
// }).catch((error) => {
//   console.log(error);
// });





const config: AxiosRequestConfig = {
  headers: {
    Authorization: 'Bearer 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',
    "Content-Type": 'application/json'
  }
}

// 发送消息
export const sendMessage = async (msg: string) => {
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [{ "role": "user", "content": msg }]
  }

  try {
    const res = await axios.post('https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/chat/completions', data, config)
    console.log(res);

    const messages = res.data.choices.map((choice: { message: any; }) => choice.message)
    return messages
  } catch (error) {
    return ''
  }
};

// 获取模型列表
export const getModelList = async () => {
  const res = await axios.get('https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/models', config)
  return res.data
}

// 检索模型
export const searchModel = async (model: string) => {
  const res = await axios.get(`https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/models/${model}`, config)
  return res.data
}