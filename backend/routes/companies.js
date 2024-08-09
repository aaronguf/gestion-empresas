import { Router } from 'express'

import { CompanyController } from '../controllers/companies.js'

export const companiesRouter = Router()

companiesRouter.get('/', CompanyController.getAll)
companiesRouter.post('/', CompanyController.create)

companiesRouter.get('/:id', CompanyController.getById)
companiesRouter.delete('/:id', CompanyController.delete)
companiesRouter.patch('/:id', CompanyController.update)
