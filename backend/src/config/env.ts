import * as z from 'zod'

const schema = z.object({
    AUTH_TOKEN: z.string().min(1, 'AUTH_TOKEN is required'),
})

export const env = schema.parse(process.env)
