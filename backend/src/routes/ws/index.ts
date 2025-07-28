import type WebSocket from 'ws'
import WebSocketRouter from './router.js'
import { handleGetLoginUrl } from './get-login-url.ts'
import { handleGetSinglePayment } from './get-single-payment.ts'
import type { MintTokenRequest, WebSocketMessage, GetSinglePaymentMessage } from './types.ts'
import { PortalDeamon } from '../../services/portal-deamon.ts'

const router = new WebSocketRouter()

router.register('get-login-url', async (ws) => {
    await handleGetLoginUrl(ws)
})

router.register('get-single-payment', async (ws, data) => {
    await handleGetSinglePayment(ws, data as GetSinglePaymentMessage)
})

router.register('mint-token', async(ws, data) => {
    const parsedData = data as MintTokenRequest;
    console.log('mint token!!!');

    const client = await PortalDeamon.getClient()
    const token = await client.mintCashu(
        'http://10.10.2.45:3338',
        'tokentokentoken',
        'lido',
        1,
        'Descrizione di prova'
    );

    client.sendCashuDirect(parsedData.payload.pubkey, [], token)
})

export function handleWebsocketConnection(ws: WebSocket) {
    console.log('New client connected')

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString()) as WebSocketMessage
        await router.handle(data, ws)
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
}
