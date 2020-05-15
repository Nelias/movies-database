const { check } = require('express-validator')
const genresCheck = require('./genres-check')

const findMovieValidationSchema = [
  check('runtime').optional().isInt().withMessage('Runtime must be a number'),
  check('genres')
    .optional()
    .custom((value) => {
      return genresCheck(value)
    }),
]

module.exports = findMovieValidationSchema
