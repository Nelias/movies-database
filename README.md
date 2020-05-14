# movies-database

## API endpoints

### add-movie

The available query parameters are:

```
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- genres (required, array of predefined strings from a database)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)
```

In practice:
`/add-movie?title=Dune&year=2020&runtime=180&genres=Sci-Fi&director=Denis%20Villeneuve&actors=Rebecca%20Ferguson,%20Josh%20Brolin&plot=sand`

## Installation

#### Requirements

- npm
- node >= 8

```
git clone git@github.com:Nelias/movies-database.git
cd movies-database
npm install
```

Run application

```
npm start
```

Use it

```
curl 127.0.0.1:8080
```
