const fs = require('fs').promises
const path = require('path')
const databasePath = path.join(__dirname, '..', 'database', 'db.json')
const { validationResult } = require('express-validator')

const addMovie = async (req, res, next) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() })
  }

  try {
    const data = await fs.readFile(databasePath)

    const database = JSON.parse(data)

    const newMovie = {
      id: database.movies[database.movies.length - 1].id + 1,
      title: req.query.title,
      year: req.query.year,
      runtime: req.query.runtime,
      genres: Array.isArray(req.query.genres)
        ? [...req.query.genres]
        : [req.query.genres],
      director: req.query.director,
      actors: req.query.actors || null,
      plot: req.query.plot || null,
      posterUrl: req.query.posterUrl || null,
    }

    database.movies.push(newMovie)

    fs.writeFile(databasePath, JSON.stringify(database, null, 2), () => {
      res.status(200).send('New movie added successfully!')
    })
  } catch (err) {
    return res.status(500).send(err)
  }
}

module.exports = addMovie
