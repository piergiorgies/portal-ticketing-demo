import WebSocket from 'ws'
import { PortalDeamon } from './services/portal-deamon.js'
import WebSocketRouter, { type LoginUrlMessage, type WebSocketMessage } from './routes/ws/router.js'

const handleGetLoginUrl = async (ws: WebSocket): Promise<LoginUrlMessage> => {
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

router.register('mint-token', async(ws, data) => {
    
});

export function handleWebsocketConnection(ws: WebSocket) {
    console.log('New client connected')

    ws.on('message', async(message) => {
        const data = JSON.parse(message.toString()) as WebSocketMessage
        router.handle(data, ws);
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
}
