import WebSocket from 'ws'
import { PortalDeamon } from './services/portal-deamon.js'

export const wss = new WebSocket.Server({ port: 8000 })

type GetLoginUrlMessage = {
    type: 'get-login-url'
    payload: {}
}

type LoginUrlMessage = {
    type: 'login-url'
    payload: {
        loginUrl: string
    }
}

type ErrorMessage = {
    type: 'error'
    payload: {
        message: string
    }
}

type WebSocketMessage = GetLoginUrlMessage | LoginUrlMessage | ErrorMessage

const handleGetLoginUrl = async (): Promise<LoginUrlMessage> => {
    const client = await PortalDeamon.getClient()
    const loginUrl = await client.newKeyHandshakeUrl(async (mainKey) => {
        const authResponse = await client.authenticateKey(mainKey)
        console.log('Authentication response:', authResponse)
    })

    return {
        type: 'login-url',
        payload: {
            loginUrl,
        },
    }
}

wss.on('connection', async (ws) => {
    console.log('New client connected')

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString()) as WebSocketMessage
        console.log('Received message:', data)

        switch (data.type) {
            case 'get-login-url':
                ws.send(JSON.stringify(await handleGetLoginUrl()))
                break
            default:
                ws.send(
                    JSON.stringify({
                        type: 'error',
                        payload: {
                            message: `Unknown message type: ${data.type}`,
                        },
                    } satisfies ErrorMessage),
                )
                break
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})
