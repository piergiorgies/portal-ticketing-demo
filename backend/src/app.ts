import express from 'express'
import expressWs from 'express-ws'
import { router } from './routes/index.js'
import { env } from './config/env.ts'
import cors from 'cors'; 

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

export const { app } = expressWs(express());
app.use(cors(corsOptions))

app.use('/api', router)

app.get('/', (_req, res) => {
    res.send('Hello World!')
})

router.get('/.well-known/nostr.json', (_req, res) => {
    res.json({
        names: {
            lidodilugano: env.PUB_NOSTR_KEY,
        },
    })
})
