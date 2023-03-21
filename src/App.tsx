import { useState } from 'react'
import { Button, AppBar, Toolbar, Paper, SnackbarContent } from '@material-ui/core'
import { sendMessage, getModelList, searchModel } from './apis'
import './App.css'

function App() {
  const [inputVal, setInputVal] = useState('')
  const [chatList, setChatList] = useState<any[]>([])

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
    setTimeout(() => {
      setChatList([
        ...result,
        ...res
      ])
    }, 0)
  };

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
        }} />
        <Button className='send-btn' variant="contained" color="primary" onClick={handleSendMessage}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default App
