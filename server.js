const express = require('express')
const app = express()
const addMovie = require('./controllers/add-movie')
const movieValidationSchema = require('./validation/movie-validation')
const findMovie = require('./controllers/find-movie')
const findMovieValidationSchema = require('./validation/find-validation')

app.get('/', (req, res) => {
  res.send('There are two endpoints available: add-movie and find-movie')
})

app.get('/add-movie', movieValidationSchema, addMovie)

app.get('/find-movie', findMovieValidationSchema, findMovie)

const server = app.listen(8080, () => {
  console.log('Server running on port 8080')
})

module.exports = server
