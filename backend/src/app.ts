import express from 'express'
import expressWs from 'express-ws'
import { router, handleWebsocketConnection } from './routes/index.js'
import cors from 'cors'
import { AdminWebSocketManager } from './services/admin-websocket.ts'
import { PortalDeamon } from './services/portal-deamon.ts'
import { env } from './config/env.ts'

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}

export const { app } = expressWs(express())
app.use(cors(corsOptions))

app.ws('/ws', (ws) => {
    handleWebsocketConnection(ws)
})
app.ws('/admin/ws', async(ws, req) => {
    const { token, pubkey } = req.query;
    if(!token || !pubkey) return;

    const client = await PortalDeamon.getClient()
    const isValid = await client.verifyJwt(String(pubkey), String(token));
    if (!isValid?.target_key) return;
    if(pubkey !== env.ADMIN_PUB_NOSTR_KEY) return;

    const manager = AdminWebSocketManager.getInstance()
    manager.addConnection(ws)
})

app.use('/api', router)

app.get('/', (_req, res) => {
    res.send('Service is running')
})
