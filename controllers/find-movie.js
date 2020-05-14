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

    const searchedGenres = req.query.genres
    const searchedRuntime = req.query.runtime

    if (!searchedGenres && !searchedRuntime) {
      res.status(200).json([database.movies.sample()])
    }

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() })
    }

    if (!searchedRuntime) {
      const foundMovies = database.movies.filter((movie) => {
        if (typeof searchedGenres === 'object') {
          return searchedGenres.every((genre) => movie.genres.includes(genre))
        } else {
          return movie.genres.includes(searchedGenres)
        }
      })

      searchResponse(foundMovies)
    } else {
      const foundRuntimeMovies = database.movies.filter(
        (movie) =>
          Number(movie.runtime) >= Number(searchedRuntime) - 10 &&
          Number(movie.runtime) <= Number(searchedRuntime) + 10
      )

      if (!searchedGenres) {
        searchResponse([foundRuntimeMovies.sample()])
      } else {
        const genresMovies = foundRuntimeMovies.filter((movie) => {
          if (typeof searchedGenres === 'object') {
            if (movie.genres.length === searchedGenres.length) {
              return searchedGenres.every((genre) => {
                return movie.genres.includes(genre)
              })
            }

            if (
              movie.genres.length < searchedGenres.length &&
              movie.genres.length > 1
            ) {
              const matches = searchedGenres.filter((genre) => {
                return movie.genres.includes(genre)
              })

              return (
                matches.length < searchedGenres.length &&
                matches.length > 1 &&
                matches.length === movie.genres.length
              )
            }

            if (movie.genres.length === 1) {
              return searchedGenres.some((genre) => {
                return movie.genres.includes(genre)
              })
            }
          } else {
            return movie.genres.includes(searchedGenres)
          }
        })

        searchResponse(genresMovies)
      }
    }
  })
}

module.exports = findMovie
