import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '1234',
  database: 'companiesdb'
}

const connection = await mysql.createConnection(config)

export class CompanyModel {
  static async getAll () {
    const [companies] = await connection.query(
      'SELECT company_name, constitution_date, company_type, company_comments, company_fav, BIN_TO_UUID(company_id) FROM company ORDER BY company_name ASC;'
    )
    return companies
  }

  static async getById ({ id }) {
    const [company] = await connection.query(
      'SELECT company_name, constitution_date, company_type, company_comments, company_fav, BIN_TO_UUID(company_id) company_id FROM company WHERE company_id = UUID_TO_BIN(?);',
      [id]
    )
    if (company.length === 0) return null

    return company[0]
  }

  static async create ({ input }) {
    const {
      company_name,
      constitution_date,
      company_type,
      company_comments,
      company_fav
    } = input

    const [existingCompany] = await connection.query(
      'SELECT BIN_TO_UUID(company_id) as company_id FROM company WHERE company_name = ?;',
      [company_name]
    )

    if (existingCompany.length > 0) {
      return {
        message: 'No se puede crear la compañia porque ya está registrada'
      }
    }

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO company (company_id, company_name, constitution_date, company_comments, company_type, company_fav) 
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?);`,
        [
          company_name,
          constitution_date,
          company_comments,
          company_type,
          company_fav
        ]
      )
    } catch (e) {
      throw new Error('Error creating company')
    }

    const [company] = await connection.query(
      `SELECT company_name, constitution_date, company_comments, company_type, company_fav, BIN_TO_UUID(company_id) company_id
        FROM company WHERE company_id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return company[0]
  }

  static async delete ({ id }) {
    const [company] = await connection.query(
      `
      SELECT BIN_TO_UUID(company_id) id FROM company WHERE company_id = UUID_TO_BIN(?);`,
      [id]
    )
    if (company.length === 0) return null

    await connection.query(
      `
      DELETE FROM company WHERE company_id = UUID_TO_BIN(?);`,
      [id]
    )

    return { message: 'Company deleted successfully' }
  }

  static async update ({ id, input }) {
    // Apoyo con IA, para la funcion update
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
        `UPDATE company SET ${fields} WHERE company_id = UUID_TO_BIN(?);`,
        [...values, id]
      )
    } catch (e) {
      throw new Error('Error updating company')
    }

    const [updatedCompany] = await connection.query(
      `SELECT company_name, constitution_date, company_type, company_comments, company_fav, BIN_TO_UUID(company_id) company_id
      FROM company WHERE company_id = UUID_TO_BIN(?);`,
      [id]
    )

    return updatedCompany[0]
  }
}
