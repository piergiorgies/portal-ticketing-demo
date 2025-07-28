import WebSocket from 'ws'
import WebSocketRouter from './router.js'
import { handleGetLoginUrl } from './get-login-url.ts'
import type { WebSocketMessage } from './types.ts'

const router = new WebSocketRouter()

router.register('get-login-url', async (ws) => {
    ws.send(JSON.stringify(await handleGetLoginUrl(ws)))
})

export function handleWebsocketConnection(ws: WebSocket) {
    console.log('New client connected')

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString()) as WebSocketMessage
        router.handle(data, ws)
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
}
