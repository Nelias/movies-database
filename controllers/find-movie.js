const fs = require('fs').promises
const path = require('path')
const databasePath = path.join(__dirname, '..', 'database', 'db.json')
const { validationResult } = require('express-validator')

const findMovie = async (req, res, next) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() })
  }

  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)]
  }

  const searchResponse = (foundMovies) => {
    if (foundMovies && foundMovies.length) {
      return res.status(200).json(foundMovies)
    } else {
      return res.status(404).send('There are no results for your query!')
    }
  }

  try {
    const data = await fs.readFile(databasePath)

    const database = JSON.parse(data)
    const searchedGenres = req.query.genres
    const searchedRuntime = req.query.runtime

    if (!searchedGenres && !searchedRuntime) {
      return res.status(200).json([database.movies.sample()])
    }

    if (!searchedRuntime) {
      const foundMovies = database.movies.filter((movie) => {
        if (Array.isArray(searchedGenres)) {
          return searchedGenres.some((genre) => movie.genres.includes(genre))
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
        const genresMovies = foundRuntimeMovies
          .filter((movie) => {
            if (Array.isArray(searchedGenres)) {
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
          .sort((a, b) => {
            if (a.genres.length > b.genres.length) return -1
            if (a.genres.length < b.genres.length) return 1
            return 0
          })

        searchResponse(genresMovies)
      }
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

module.exports = findMovie
