import { CompanyModel } from '../models/mysql/companies.js'
import { validateCompany, validatePartialCompany } from '../schemas/companies.js'

export class CompanyController {
  static async getAll (req, res) {
    const { genre } = req.query
    const companies = await CompanyModel.getAll({ genre })
    res.json(companies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const company = await CompanyModel.getById({ id })
    if (company) return res.json(company)
    res.status(404).json({ message: 'Company not found' })
  }

  static async create (req, res) {
    const result = validateCompany(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newCompany = await CompanyModel.create({ input: result.data })

    res.status(201).json(newCompany)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await CompanyModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Company not found' })
    }

    return res.json({ message: 'Company deleted' })
  }

  static async update (req, res) {
    const result = validatePartialCompany(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedCompany = await CompanyModel.update({ id, input: result.data })

    return res.json(updatedCompany)
  }
}
