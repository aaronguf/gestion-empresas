import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '1234',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      const [{ id: genreId }] = genres

      const [movies] = await connection.query(
        // Apoyo con IA -->  Query para solicitar las peliculas separadas por genero
        `SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.rate 
        FROM movie m
        JOIN movie_genres mg ON m.id = mg.movie_id
        WHERE mg.genre_id = ?;`,
        [genreId]
      )
      return movies
    }
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie;'
    )

    return movies
  }

  static async getById ({ id }) {
    const [movie] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )
    if (movie.length === 0) return null

    return movie[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [existingMovie] = await connection.query(
      'SELECT BIN_TO_UUID(id) as id FROM movie WHERE title = ?;',
      [title]
    )

    if (existingMovie.length > 0) {
      return { message: 'No se puede crear la pelicula porque ya está registrada' }
    }

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {
    const [movie] = await connection.query(
      `
      SELECT BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )
    if (movie.length === 0) return null

    await connection.query(
      `
      DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    return { message: 'Movie deleted successfully' }
  }

  static async update ({ id, input }) { // Apoyo con IA, para la funcion update
    // Extraer solo las claves y valores definidos en 'input'
    const fields = Object.keys(input)
      .filter((key) => input[key] !== undefined)
      .map((key) => `${key} = ?`)
      .join(', ')

    if (!fields) {
      throw new Error('No fields provided to update')
    }

    const values = Object.values(input).filter((value) => value !== undefined)

    try {
      await connection.query(
        `UPDATE movie SET ${fields} WHERE id = UUID_TO_BIN(?);`,
        [...values, id]
      )
    } catch (e) {
      throw new Error('Error updating movie')
    }

    const [updatedMovie] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    return updatedMovie[0]
  }
}
