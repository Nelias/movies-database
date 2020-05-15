const path = require('path')
const fs = require('fs')
const databasePath = path.join(__dirname, '..', 'database', 'db.json')

const genresCheck = (value) => {
  const data = fs.readFileSync(databasePath)

  const database = JSON.parse(data)

  if (Array.isArray(value)) {
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
          `The genre ${value} does not exist! The available genres are: ${database.genres.join(
            ', '
          )}`
        )
  }
}

module.exports = genresCheck
