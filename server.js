const express = require('express')
const app = express()
const addMovie = require('./controllers/add-movie')
const movieValidationSchema = require('./validation/movie-validation')

app.get('/', (req, res) => {
  res.send('none')
})

app.get('/add-movie', movieValidationSchema, addMovie)

app.listen('8080')
