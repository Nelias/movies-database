# movies-database

Technologies used in this project are:

<div>
<img src="https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png" width="70" height="70">
<img src="https://nicolab.net/assets/img/skills/express-js.png" width="70" height="70">
<img src="https://opencollective-production.s3-us-west-1.amazonaws.com/149387c0-712d-11e8-a49d-c7c15c79a92c.png" width="70" height="70">
</div>

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

```
/add-movie?title=Dune&year=2020&runtime=180&genres=Sci-Fi&director=Denis%20Villeneuve&actors=Rebecca%20Ferguson,%20Josh%20Brolin&plot=sand
```

### find-movie

The available query parameters are:

```
- genres (optional, array of predefined strings from a database)
- runtime (optional, number)
```

In practice:

```
/find-movie?genres=Drama&genres=Mystery&genres=Thriller&genres=Biography&runtime=130
```

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
