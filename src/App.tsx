import { useEffect, useRef, useState } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Paper,
  SnackbarContent,
} from '@material-ui/core';
import {
  sendMessage,
  completions,
  edits,
  images,
  getModelList,
  searchModel,
  getAudio,
} from './apis';
import './App.css';
// import { initWs, send, blobToBase64 } from './utils/asrInNode';
import test from './utils/iat.js';

function App() {
  const [inputVal, setInputVal] = useState('');
  const [chatList, setChatList] = useState<any[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const [isRecord, setIsRecord] = useState(false);
  // 存放 MediaRecoder
  const mediaRecorderRef = useRef<MediaRecorder>();
  // 存储录音数据块
  const audioDataRef = useRef<Blob>();

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGetModelList = () => {
    getModelList().then((res) => {
      console.log(res);
    });
  };

  const handleSearchModel = () => {
    searchModel('gpt-3.5-turbo').then((res) => {
      console.log(res);
    });
  };

  const handleSendMessage = async () => {
    const result = [...chatList];
    result.push({
      role: 'user',
      content: inputVal,
    });
    setChatList(result);
    setInputVal('');
    const res = await sendMessage(inputVal);
    result.concat(res);
    setTimeout(() => {
      setChatList([...result, ...res]);

      handlePlayAudio();
    }, 0);
  };

  // 播放音频
  const handlePlayAudio = () => {
    console.log(audioRef);
    // audioRef.current?.play();
  };

  const startRecordVoiceMessage = async () => {
    setIsRecord(true);
    // 请求麦克风权限
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const tempAudioData: Blob[] = [];
        // 创建媒体记录
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });
        // 开始录制
        mediaRecorderRef.current!.start();

        // 处理音频数据
        mediaRecorderRef.current!.addEventListener('dataavailable', (ev) => {
          // 把数据块添加到数组
          tempAudioData.push(ev.data);
        });

        // 录音停止
        mediaRecorderRef.current!.addEventListener('stop', () => {
          // 把音频数据块转换为 Blob
          audioDataRef.current = new Blob(tempAudioData);
          setIsRecord(false);

          // todo 语音识别
        });
      })
      .catch((info) => {
        alert('无法获取麦克风权限！错误信息：' + info);
        setIsRecord(false);
      });
  };

  const stopRecordVoiceMessage = () => {
    mediaRecorderRef.current?.stop();
  };

  const playVoice = () => {
    if (!audioDataRef.current) return false;
    const audio = new Audio(URL.createObjectURL(audioDataRef.current));
    // 播放音频
    audio.play();
    // blobToBase64(audioDataRef.current, (data: string) => {
    //   send('', 0);
    //   send(data, 1);
    //   send('', 2);
    // });
  };

  useEffect(() => {
    // initWs({
    //   onOpen: () => {},
    //   onMessage: () => {},
    //   onClose: () => {},
    //   onError: () => {},
    // });
    // test((text: string) => {
    //   setInputVal(text);
    // });
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      // audioRef.current?.play();
    }
  }, [audioUrl]);

  return (
    <div className="app">
      {/* <Button className='send-btn' variant="contained" color="primary" onClick={handleGetModelList}>
      获取模型列表
    </Button>

    <Button className='send-btn' variant="contained" color="primary" onClick={handleSearchModel}>
      检索模型
    </Button> */}
      <AppBar position="static">
        <Toolbar>
          OpenAI Demo
          <audio controls ref={audioRef} autoPlay></audio>
        </Toolbar>
      </AppBar>

      <div className="contents">
        <Paper className="paper">
          {chatList.map((item, index) => {
            const { role, content } = item;
            return (
              <SnackbarContent
                className={`item ${role}`}
                key={index}
                message={content}
                action={role}
              />
            );
          })}
        </Paper>
      </div>

      <div className="footer">
        <input
          type="text"
          id="result_output"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              handleSendMessage();
            }
          }}
        />
        <Button
          disabled={isRecord}
          className="send-btn"
          variant="contained"
          color="primary"
          onClick={() => {
            // startRecordVoiceMessage
            test((text: string) => {
              setInputVal(text);
            });
          }}
        >
          开始录音
        </Button>
        <Button
          disabled={!isRecord}
          className="send-btn"
          variant="contained"
          color="primary"
          onClick={stopRecordVoiceMessage}
        >
          停止录音
        </Button>
        <Button
          disabled={!audioDataRef.current}
          className="send-btn"
          variant="contained"
          color="primary"
          onClick={playVoice}
        >
          播放录音
        </Button>
        <Button
          className="send-btn"
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
        >
          发送
        </Button>
      </div>
    </div>
  );
}

export default App;
