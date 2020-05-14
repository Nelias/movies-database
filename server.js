const express = require('express')
const app = express()
const addMovie = require('./controllers/add-movie')
const movieValidationSchema = require('./validation/movie-validation')
const findMovie = require('./controllers/find-movie')
const findMovieValidationSchema = require('./validation/find-validation')

app.get('/', (req, res) => {
  res.send('none')
})

app.put('/add-movie', movieValidationSchema, addMovie)

app.get('/find-movie', findMovieValidationSchema, findMovie)

app.listen('8080')
