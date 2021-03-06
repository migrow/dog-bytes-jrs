require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const videos = require('./routes/videos')
const quotes = require('./routes/quotes')

app.use(bodyParser.json())
app.use(cors({ credentials: true }))

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Dog Bytes JRS API.')
})

videos(app)
quotes(app)

app.listen(PORT, () => console.log('API UP!! on ', PORT))
