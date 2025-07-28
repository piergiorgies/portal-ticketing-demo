import express from 'express'
import expressWs from 'express-ws'
import { router, handleWebsocketConnection } from './routes/index.js'

export const { app } = expressWs(express())

app.ws('/ws', (ws) => {
    handleWebsocketConnection(ws)
})

app.use('/api', router)

app.get('/', (_req, res) => {
    res.send('Service is running')
})
