const fs = require('fs')
const path = require('path')
const jsonPath = path.join(__dirname, '..', 'database', 'db.json')
const { validationResult } = require('express-validator')

const findMovie = (req, res, next) => {
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)]
  }

  fs.readFile(jsonPath, (err, data) => {
    if (err) {
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
      res
        .status(200)
        .json(
          database.movies
            .filter(
              (movie) =>
                Number(movie.runtime) >= Number(req.query.runtime) - 10 &&
                Number(movie.runtime) <= Number(req.query.runtime) + 10
            )
            .sample()
        )
    }
  })
}

module.exports = findMovie
