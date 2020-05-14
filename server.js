const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('none')
})

app.listen('8080')
