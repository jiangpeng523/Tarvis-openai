/**
 *
 * 运行前：请先填写Appid、APIKey、APISecret
 *
 * 语音听写流式 WebAPI 接口调用示例 接口文档（必看）：https://doc.xfyun.cn/rest_api/语音听写（流式版）.html
 * webapi 听写服务参考帖子（必看）：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=38947&extra=
 * 语音听写流式WebAPI 服务，热词使用方式：登陆开放平台https://www.xfyun.cn/后，找到控制台--我的应用---语音听写---服务管理--上传热词
 * 注意：热词只能在识别的时候会增加热词的识别权重，需要注意的是增加相应词条的识别率，但并不是绝对的，具体效果以您测试为准。
 * 错误码链接：https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * @author iflytek
 */
import CryptoJS from 'crypto-js';

// 系统配置
const config = {
  // 请求地址
  hostUrl: 'wss://iat-api.xfyun.cn/v2/iat',
  host: 'iat-api.xfyun.cn',
  //在控制台-我的应用-语音听写（流式版）获取
  appid: '9bef68ff',
  //在控制台-我的应用-语音听写（流式版）获取
  apiSecret: 'OGVkYTJmZDZkMDNiY2JmYjA1NGM0NTg3',
  //在控制台-我的应用-语音听写（流式版）获取
  apiKey: 'a865e13fbc0a39f82921e443fa42154e',
  file: './16k_10.pcm', //请填写您的音频文件路径
  uri: '/v2/iat',
  highWaterMark: 1280,
};

// 帧定义
const FRAME = {
  STATUS_FIRST_FRAME: 0,
  STATUS_CONTINUE_FRAME: 1,
  STATUS_LAST_FRAME: 2,
};

// 获取当前时间 RFC1123格式
let date = new Date().toUTCString();
// 设置当前临时状态为初始化
let status = FRAME.STATUS_FIRST_FRAME;
// 记录本次识别用sid
let currentSid = '';
// 识别结果
let iatResult: any[] = [];

let wssUrl =
  config.hostUrl +
  '?authorization=' +
  getAuthStr(date) +
  '&date=' +
  date +
  '&host=' +
  config.host;

let ws = new WebSocket(wssUrl);


// 鉴权签名
function getAuthStr(date: string) {
  let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`;
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret);
  let signature = CryptoJS.enc.Base64.stringify(signatureSha);
  let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  let authStr = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(authorizationOrigin)
  );
  return authStr;
}

// 传输数据
function send(data: string, currentStatus: 0 | 1 | 2) {
  let frame = {};
  let frameDataSection = {
    format: 'audio/L16;rate=16000',
    encoding: 'raw',
  };
  switch (currentStatus) {
    case FRAME.STATUS_FIRST_FRAME:
      frame = {
        // 填充common
        common: {
          app_id: config.appid,
        },
        //填充business
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          dwa: 'wpgs', // 可选参数，动态修正
          sample_rate: "16000",
          vad_eos: 5000,
        },
        //填充data
        data: {
          ...frameDataSection,
          audio: '',
          status: 0,
        },
      };
      // status = FRAME.STATUS_CONTINUE_FRAME;
      break;
    case FRAME.STATUS_CONTINUE_FRAME:
      frame = {
        //填充data
        data: {
          ...frameDataSection,
          audio: "QAi6CKMJ4gnWCR4KKQp8ClYKhwkHCKoGXAXXA7wCNwFr/+/9Ov2d/KX7X/w3/aH9m/7q/pz9Af2L/P/8CP4h/YT8KvyE+wL7bfnR9wP3lfWj9SP3SPcG+Dr4Bfjy+Gn7Pf2w/70A1/8y/hH9nPzI/Cv9AfwX+8/4kfa39wr5Z/mP+er4/vcD+eT5O/pA+4P7vvmy+KD48vic+cr5Pfo7+Vv3X/eo+AT6mPp+/Mb9mP5D/zAA/AIkBoMHsQfjCPgIJgj1B+4HMQidB1oFHAT9AucB7AEfAscCngKbAFz/Ov9X/wsA4AC0AJz///4+/4YA+QGjAWoBFQIoAWYAlQFkAnsCHQJOAloDbgQGBYIFGgUnBCEDrwF/AMAACv/R/Bj8uvvq+qL6wfrP+Un5jPnC+oH8kf10/ob+Zv6L/af8n/wO/Iv7ffsU/J78bPxR/If9f/8kAJ4AbQE/AcIBFALAAeUBwAFrAGj/Nv+E/lP+r/6b/gf9mfv7+7H+9QA6A6ADOgRBBcsF+AaNCOAIygfdBjUGGgVQBPUCXgHw/3L9wPuT+8n7+Puu/Ez+1P7s/1UBYgKPA6MEJQUwBZEEtQIVARoBfgD9/yn/8/2L/PL7bPwm/soAsQFfAWUBoAHcAtcEMAb6BRYFdQP8ARcChQFMAFv/Bv4H/Kf7G/wT/S3+j/6h/Sj9qv7uALEC0QPTA/UCSQLUAVoAiP5N/WH8W/si+lP5Tfk0+hL8Gf1b/UD9gvzv/DX+Kf9e/4L+Bf5Z/Rf+5f4jABkBJwHaAXkC/wMCBs0Hdwh1B4AGwQULBbAEnAQdA9oAfP4D/aH8CP2v/Er83foq+qP6E/yH/fr/OQFAARICUgLzAxUGbQfCB6wHUQZEBd4F+wW3BRQG7QUcBSYEwQMGBBQF8QXtBLMDxAIJAs4C3QIvAooBy/6D/Mz7Svzu/LX8HPzR+uP45PcF9+32ZvdS98L1wvS19Jz1s/cM+qb7/vt6+1n79vuH/Yz+Zv+S/qX8R/u5+5T8EP1L/lr/EP+c/fH8av56AH4BvQFqARoBDAHdAawDrATyBBIEXQKEAcoAVwAWAGj/VP3O+hj6RvoK+yD9Lv9SABMBNAIGBCAGrwfgB+IH/QZhBR4E7wOYA6YCGAG0/xH/+f5B/xgALACx/0z/SgBaAQ0BzP+X/t392f2H/Xz9o/1p/H367Pm7+pD7Hfxk/S//iQAAAvUDnQQHBxUJ9wkLCtMJYAmEB/oFSgUIBCACfP+e/Tn8BPz3/RMAcQFzAnkDdgQoBh8IPgmPCEEGRAOaAMf/HAB6ADYA3v0Z+wr6k/op/K39sf0v/In6hPoe/AH/MgIqBDQEVANUAnECdAOxA5MCyAA5/mf8j/u8++H8Bf4m/bj89vxj/cD+HAAjAB//Q/38+8j7Y/tg+7r6ifmZ+Cf4cfg7+Z76Svuk+8f7y/uQ/XT/HQCeAOAAOAHhAZAC3QK8AjECEAHiAC4B3wGDAVcBFwGOAL4AjgHpAmoEAAVjBPkCMwIbAhECuwFiAMX+8PxE+7f66/tb/P77iPuN+/P7av0E/7AAWQKiAlICGwLJAqQDzwS/BIgDJQLjAVMCxgN4BHQE9QK/ADX/SP5Z/vz9V/2p/O77tvvr/Dn+s/90AE4AT/8F/z//0/9LADAA7P8a/27+Yf5p/wcBNALeAV4BaAFmAkQEXQV4Bu0GXAY3BVUFfQU=",
          status: 1,
        },
      };
      break;
    case FRAME.STATUS_LAST_FRAME:
      //填充frame
      frame = {
        data: {
          ...frameDataSection,
          status: 2,
          audio: '',
        },
      };
      break;
  }
  ws.send(JSON.stringify(frame));
}


const initWs = ({ onOpen, onMessage, onClose, onError }) => {

  // 连接建立完毕，读取数据进行识别
  ws.addEventListener('open', (event) => {
    console.log('websocket connect!');
    onOpen && onOpen(event)

    // const blob = [];
    // var readerStream = fs.createReadStream(config.file, {
    //   highWaterMark: config.highWaterMark,
    // });
    // readerStream.on('data', function (chunk) {
    //   send(chunk);
    // });
    // // 最终帧发送结束
    // readerStream.on('end', function () {
    //   status = FRAME.STATUS_LAST_FRAME;
    //   send('');
    // });
  });

  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  ws.addEventListener('message', (event) => {
    const data = event.data;
    if (!data) {
      console.log(`err:${err}`);
      return;
    }
    let res = JSON.parse(data);
    if (res.code != 0) {
      console.log(`error code ${res.code}, reason ${res.message}`);
      return;
    }

    let str = '';
    if (res.data.status == 2) {
      // res.data.status ==2 说明数据全部返回完毕，可以关闭连接，释放资源
      str += '最终识别结果';
      currentSid = res.sid;
      ws.close();
    } else {
      str += '中间识别结果';
    }
    iatResult[res.data.result.sn] = res.data.result;
    if (res.data.result.pgs == 'rpl') {
      res.data.result.rg.forEach((i) => {
        iatResult[i] = null;
      });
      str += '【动态修正】';
    }
    str += '：';
    iatResult.forEach((i) => {
      if (i != null) {
        i.ws.forEach((j) => {
          j.cw.forEach((k) => {
            str += k.w;
          });
        });
      }
    });
    console.log(str);
    onMessage && onMessage(str)
    // ... do something
  });

  // 资源释放
  ws.addEventListener('close', () => {
    console.log(`本次识别sid：${currentSid}`);
    console.log('connect close!');
    onClose && onClose()
  });

  // 建连错误
  ws.addEventListener('error', (err) => {
    console.log('websocket connect err: ' + err);
    onError && onError(err)
  });
}

export { initWs, send, blobToBase64 }


const blobToBase64 = (blob, callback) => {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function () {
    var dataUrl = reader.result;
    var base64 = dataUrl.split(',')[1];
    callback(base64);
  };
}