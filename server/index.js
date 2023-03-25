const express = require('express')
const app = express()
const { connect } = require('./tts-ws-node')
const log = require('log4node')
const Emitter = require('./events')
const port = 3333

app.use(express.static('public'))

// 设置CORS
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/audio', async (req, res) => {
  const { message } = req.query
  connect(message)
  Emitter.once('save', ({ audioFileName }) => {
    log.info('保存完成, 返回文件地址')
		return res.json({
			data: `http://localhost:3333/audios/${audioFileName}`
		})
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})