import z from 'zod'

const companySchema = z.object({
  company_name: z.string({
    invalid_type_error: 'Company name must be a string',
    required_error: 'Company name is required.'
  }),
  constitution_date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }), // Ayuda con IA
  company_type: z.string(),
  company_comments: z.string().max(1020),
  company_fav: z.boolean()
})

export function validateCompany (input) {
  return companySchema.safeParse(input)
}

export function validatePartialCompany (input) {
  return companySchema.partial().safeParse(input)
}
