import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  headers: {
    Authorization: 'Bearer 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',
    "Content-Type": 'application/json'
  }
}

// 生成音频
export const getAudio = async (msg: string) => {
  const res = await axios.get('http://localhost:3333/audio', {
    params: {
      message: msg
    }
  });
  return res.data.data;
}

// 发送消息
export const sendMessage = async (msg: string) => {
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": msg}]
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

// completions Api
export const completions = async (msg: string) => {
  const res = await axios.post('https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/completions', {
    "model": "text-davinci-003",
    "prompt": msg,
  }, config)

  return res.data;
}

// edits Api
export const edits = async (msg: string) => {
  const res = await axios.post('https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/edits', {
    "model": "text-davinci-edit-001",
    input: msg,
    instruction: "翻译成英文"
  }, config)

  return res.data;
}

// images Api
export const images = async (msg: string) => {
  const res = await axios.post('https://service-g47odsm8-1307912760.hk.apigw.tencentcs.com/v1/images/generations', {
    "prompt": msg,
    size: '256x256'
  }, config)

  return res.data;
}