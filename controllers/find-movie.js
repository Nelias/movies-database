const fs = require('fs')
const path = require('path')
const jsonPath = path.join(__dirname, '..', 'database', 'db.json')
const { validationResult } = require('express-validator')

const findMovie = (req, res, next) => {
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)]
  }

  const searchResponse = (foundMovies) => {
    if (foundMovies && foundMovies.length) {
      res.status(200).json(foundMovies)
    } else {
      res.status(404).send('There are no search results for your query')
    }
  }

  fs.readFile(jsonPath, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error')
      throw err
    }

    const database = JSON.parse(data)

    if (!req.query.genres && !req.query.runtime) {
      res.status(200).json(database.movies.sample())
    }

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() })
    }

    if (!req.query.genres) {
      const foundMovies = database.movies
        .filter(
          (movie) =>
            Number(movie.runtime) >= Number(req.query.runtime) - 10 &&
            Number(movie.runtime) <= Number(req.query.runtime) + 10
        )
        .sample()

      searchResponse(foundMovies)
    } else if (!req.query.runtime) {
      const foundMovies = database.movies.filter((movie) => {
        if (typeof req.query.genres === 'object') {
          return req.query.genres.every((genre) => movie.genres.includes(genre))
        } else {
          return movie.genres.includes(req.query.genres)
        }
      })

      searchResponse(foundMovies)
    } else {
      const foundMovies = database.movies
        .filter(
          (movie) =>
            Number(movie.runtime) >= Number(req.query.runtime) - 10 &&
            Number(movie.runtime) <= Number(req.query.runtime) + 10
        )
        .filter((movie) => {
          if (typeof req.query.genres === 'object') {
            if (movie.genres.length === 1) {
              return req.query.genres.some((genre) => {
                return movie.genres.includes(genre)
              })
            }
          } else {
            return movie.genres.includes(req.query.genres)
          }
        })

      searchResponse(foundMovies)
    }
  })
}

module.exports = findMovie
