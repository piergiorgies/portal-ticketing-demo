import * as z from 'zod'

const schema = z.object({
    AUTH_TOKEN: z.string().min(1, 'AUTH_TOKEN is required'),
    NOSTR_KEY: z.string().min(1, 'NOSTR_KEY is required'),
    PUB_NOSTR_KEY: z.string().min(1, 'PUB_NOSTR_KEY is required'),
    CASHU_URL: z.string().min(1, 'CASHU_URL is required'),
    CASHU_TOKEN: z.string().min(1, 'CASHU_TOKEN is required'),
    ADMIN_PUB_NOSTR_KEY: z.string().min(1, 'ADMIN_PUB_NOSTR_KEY is required'),
})

export const env = schema.parse(process.env)
