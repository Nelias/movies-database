const { check } = require('express-validator')
const genresCheck = require('./genres-check')

const movieValidationSchema = [
  check('title')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1 })
    .withMessage('Title must be at least 1 character long')
    .isLength({ max: 255 })
    .withMessage('Title can not be longer than 255 characters'),
  check('year').isInt().withMessage('Year must be a number'),
  check('runtime').isInt().withMessage('Runtime must be a number'),
  check('genres').custom((value) => {
    return genresCheck(value)
  }),
  check('director')
    .isString()
    .withMessage('Director must be a string')
    .isLength({ min: 1 })
    .withMessage('Director must be at least 1 character long')
    .isLength({ max: 255 })
    .withMessage('Director can not be longer than 255 characters'),
  check('actors').optional().isString().withMessage('Actors must be a string'),
  check('plot').optional().isString().withMessage('Plot must be a string'),
  check('posterUrl')
    .optional()
    .isString()
    .withMessage('posterUrl must be a string'),
]

module.exports = movieValidationSchema
