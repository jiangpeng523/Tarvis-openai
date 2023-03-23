const express = require('express')
const app = express()
const { connect, send } = require('./tts-ws-node')
const Emitter = require('./events')
const port = 3333

app.use(express.static('public'))

// 设置CORS
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.get('/audio', async (req, res) => {
  const { message } = req.query
  Emitter.on('save', () => {
		res.json({
			data: `http://localhost:3333/audios/audio.wav?timestamp=${Date.now()}`
		})
  });
  send(message, res);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connect()
})