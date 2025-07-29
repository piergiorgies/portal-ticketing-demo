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
    const { token, pubKey } = req.query;
    if(!token || !pubKey) {
        console.log('No data');
        return;
    }

    const client = await PortalDeamon.getClient()
    const isValid = await client.verifyJwt(String(pubKey), String(token));
    if (!isValid?.target_key) {
        console.log('JWT not valid');
        return;
    }
    if(pubKey !== env.ADMIN_PUB_NOSTR_KEY_HEX) {
        console.log('Not an admin');
        return;
    }

    const manager = AdminWebSocketManager.getInstance()
    manager.addConnection(ws)
})

app.use('/api', router)

app.get('/', (_req, res) => {
    res.send('Service is running')
})
