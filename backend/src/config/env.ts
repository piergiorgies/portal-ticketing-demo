import * as z from 'zod'

const schema = z.object({
    AUTH_TOKEN: z.string().min(1, 'AUTH_TOKEN is required'),
    NOSTR_KEY: z.string().min(1, 'NOSTR_KEY is required'),
    PUB_NOSTR_KEY: z.string().min(1, 'PUB_NOSTR_KEY is required'),
})

export const env = schema.parse(process.env)
