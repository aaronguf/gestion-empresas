import express, { json } from 'express'
import { companiesRouter } from './routes/companies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/empresas', companiesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
