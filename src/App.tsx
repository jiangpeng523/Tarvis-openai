import { useEffect, useRef, useState } from 'react'
import { Button, AppBar, Toolbar, Paper, SnackbarContent } from '@material-ui/core'
import { sendMessage, completions, edits, images, getModelList, searchModel, getAudio } from './apis'
import './App.css'

function App() {
  const [inputVal, setInputVal] = useState('')
  const [chatList, setChatList] = useState<any[]>([])
  const [audioUrl, setAudioUrl] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGetModelList = () => {
    getModelList().then(res => {
      console.log(res)
    })
  }

  const handleSearchModel = () => {
    searchModel('gpt-3.5-turbo').then(res => {
      console.log(res)
    })
  }

  const handleSendMessage = async () => {
    const result = [...chatList];
    result.push({
      role: 'user',
      content: inputVal

    })
    setChatList(result)
    setInputVal('')
    const res = await sendMessage(inputVal)
    result.concat(res);
    setTimeout(async () => {
      setChatList([
        ...result,
        ...res
      ])

      // 播放音频
      const audioUrl = await getAudio(res[0].content.trim());
      setAudioUrl(audioUrl);
    }, 0)
  };

  useEffect(() => {
    if(audioRef.current) {
      audioRef.current?.play();
    }
  }, [audioUrl])

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
        </Toolbar>
      </AppBar>

      {
        audioUrl && <audio ref={audioRef} src={audioUrl}></audio>
      }

      <div className="contents">
        <Paper className='paper'>
          {
            chatList.map((item, index) => {
              const { role, content } = item;
              return (
                <SnackbarContent className={`item ${role}`} key={index} message={content} action={role} />
              );
            })
          }
        </Paper>
      </div>

      <div className='footer'>
        <input type="text" value={inputVal} onChange={e => {
          setInputVal(e.target.value)
        }} onKeyUp={e => {
          if (e.keyCode === 13) {
            handleSendMessage()
          }
        }} />
        <Button className='send-btn' variant="contained" color="primary" onClick={handleSendMessage}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default App
