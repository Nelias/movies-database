const fs = require('fs')
const path = require('path')
const jsonPath = path.join(__dirname, '..', 'database', 'db.json')
const { validationResult } = require('express-validator')

const addMovie = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  fs.readFile(jsonPath, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error')
      throw err
    }

    const database = JSON.parse(data)

    const newMovie = {
      id: database.movies[database.movies.length - 1].id + 1,
      title: req.query.title,
      year: req.query.year,
      runtime: req.query.runtime,
      genres:
        typeof req.query.genres === 'object'
          ? [...req.query.genres]
          : [req.query.genres],
      director: req.query.director,
      actors: req.query.actors || null,
      plot: req.query.plot || null,
      posterUrl: req.query.posterUrl || null,
    }

    database.movies.push(newMovie)

    fs.writeFile(jsonPath, JSON.stringify(database, null, 2), () => {
      res.status(200).send('New movie added successfully')
    })
  })
}

module.exports = addMovie
