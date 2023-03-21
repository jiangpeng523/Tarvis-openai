import axios, { AxiosRequestConfig } from "axios";

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