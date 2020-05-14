const { check } = require('express-validator')
const path = require('path')
const fs = require('fs')
const jsonPath = path.join(__dirname, '..', 'database', 'db.json')

const findMovieValidationSchema = [
  check('runtime').optional().isInt(),
  check('genres')
    .optional()
    .custom((value) => {
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
]

module.exports = findMovieValidationSchema
