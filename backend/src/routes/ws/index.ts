import WebSocket from 'ws'
import WebSocketRouter from './router.js'
import { handleGetLoginUrl } from './get-login-url.ts'
import type { GetSinglePaymentMessage, WebSocketMessage } from './types.ts'
import { handleGetSinglePayment } from './get-single-payment.ts'

const router = new WebSocketRouter()

router.register('get-login-url', async (ws) => {
    await handleGetLoginUrl(ws)
})

router.register('get-single-payment', async (ws, data) => {
    await handleGetSinglePayment(ws, data as GetSinglePaymentMessage)
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
