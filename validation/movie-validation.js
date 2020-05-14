const { check } = require('express-validator')
const path = require('path')
const fs = require('fs')
const jsonPath = path.join(__dirname, '..', 'database', 'db.json')

const movieValidationSchema = [
  check('title').isString().isLength({ min: 1, max: 255 }),
  check('year').isInt(),
  check('runtime').isInt(),
  check('genres').custom((value) => {
    const data = fs.readFileSync(jsonPath)

    const database = JSON.parse(data)

    if (typeof value === 'object') {
      return value.every((genre) => database.genres.includes(genre))
        ? true
        : Promise.reject(
            `One of your genres does not exist! The available genres are: ${database.genres.join(
              ', '
            )}`
          )
    } else {
      return database.genres.includes(value)
        ? true
        : Promise.reject(
            `This genre does not exist! The available genres are: ${database.genres.join(
              ', '
            )}`
          )
    }
  }),
  check('director').isString().isLength({ min: 1, max: 255 }),
  check('actors').optional().isString(),
  check('plot').optional().isString(),
  check('posterUrl').optional().isString(),
]

module.exports = movieValidationSchema
