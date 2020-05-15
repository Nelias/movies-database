const request = require('supertest')

describe('find movie controller', () => {
  let server

  beforeEach(() => {
    server = require('../server')
  })

  afterEach(() => {
    server.close()
  })

  it('should get a single random movie', (done) => {
    request(server)
      .get('/find-movie')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(
          res.body.every((movie) => {
            return (
              Array.isArray(movie.runtime) || typeof movie.runtime === 'string'
            )
          })
        ).toBe(true)
        done()
      })
  })

  it('should get all the movies with specific genres', (done) => {
    const queryParams = {
      genres: ['Drama', 'Sci-Fi'],
    }

    request(server)
      .get(
        `/find-movie?genres=${queryParams.genres[0]}&genres=${queryParams.genres[1]}`
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(
          res.body.every((movie) => {
            return (
              movie.genres.includes(queryParams.genres[0]) ||
              movie.genres.includes(queryParams.genres[1])
            )
          })
        ).toBe(true)
        done()
      })
  })

  it('should get a single random movie with a runtime', (done) => {
    const queryParams = {
      runtime: 90,
    }

    request(server)
      .get(`/find-movie?runtime=${queryParams.runtime}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(
          res.body[0].runtime >= queryParams.runtime - 10 &&
            res.body[0].runtime <= queryParams.runtime + 10
        ).toBe(true)
        done()
      })
  })

  it('should find all the movies that have all chosen genres and runtime', (done) => {
    const queryParams = {
      genres: ['Drama', 'Thriller'],
      runtime: 130,
    }

    request(server)
      .get(
        `/find-movie?genres=${queryParams.genres[0]}&genres=${queryParams.genres[1]}&runtime=${queryParams.runtime}`
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(
          res.body.every((movie) => {
            return (
              movie.runtime >= queryParams.runtime - 10 &&
              movie.runtime <= queryParams.runtime + 10
            )
          })
        ).toBe(true)
        expect(
          res.body.every((movie) => {
            return (
              movie.genres.includes(queryParams.genres[0]) ||
              movie.genres.includes(queryParams.genres[1])
            )
          })
        ).toBe(true)
        done()
      })
  })

  it('should get an error when there are wrong query parameters provided', (done) => {
    request(server)
      .get('/find-movie?runtime=130&genres=Horrror')
      .expect(422, done)

    request(server).get('/find-movie?genres=Horrror').expect(422, done)

    request(server).get('/find-movie?runtime=abcd').expect(422, done)
  })

  it('should return 404 if there is no matching movie', (done) => {
    request(server).get('/find-movie?runtime=5&genres=Horror').expect(404, done)
  })
})
