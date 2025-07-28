import WebSocket from 'ws'
import { PortalDeamon } from './services/portal-deamon.js'
import WebSocketRouter, { LoginUrlMessage, WebSocketMessage } from './routes/ws/router.js'

const handleGetLoginUrl = async (ws: WebSocket.WebSocket): Promise<LoginUrlMessage> => {
    const client = await PortalDeamon.getClient()
    const loginUrl = await client.newKeyHandshakeUrl(async (mainKey) => {
        const authResponse = await client.authenticateKey(mainKey)
        console.log('Authentication response:', authResponse)

        if(authResponse.status.status === 'approved') {
            ws.send(JSON.stringify({
                type: 'login-approved',
                payload: {
                    token: authResponse.status.session_token,
                    pubkey: mainKey,
                }
            }));
        } else {
            ws.send(JSON.stringify({
                type: 'login-declined',
                payload: {}
            }));
        }
    })

    return {
        type: 'login-url',
        payload: {
            loginUrl,
        },
    }
}

const router = new WebSocketRouter();
router.register('get-login-url', async(ws, data) => {
    ws.send(JSON.stringify(await handleGetLoginUrl(ws)));
})

export function handleWebsocketConnection(ws: WebSocket.WebSocket) {
    console.log('New client connected')

    ws.on('message', async(message) => {
        const data = JSON.parse(message.toString()) as WebSocketMessage
        router.route(data.type, data, ws);
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
}
