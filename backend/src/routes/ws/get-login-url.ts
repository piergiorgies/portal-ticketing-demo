import type WebSocket from 'ws'
import { PortalDeamon } from '../../services/portal-deamon.ts'
import type {
    LoginApprovedMessage,
    LoginDeclinedMessage,
    LoginUrlMessage,
} from './types.ts'

export const handleGetLoginUrl = async (
    ws: WebSocket,
): Promise<LoginUrlMessage> => {
    const client = await PortalDeamon.getClient()
    const loginUrl = await client.newKeyHandshakeUrl(async (mainKey) => {
        const authResponse = await client.authenticateKey(mainKey)
        console.log('Authentication response:', authResponse)

        if (authResponse.status.status === 'approved') {
            ws.send(
                JSON.stringify({
                    type: 'login-approved',
                    payload: {
                        token: authResponse.status.session_token!,
                        pubkey: mainKey,
                    },
                } satisfies LoginApprovedMessage),
            )
        } else {
            ws.send(
                JSON.stringify({
                    type: 'login-declined',
                    payload: {},
                } satisfies LoginDeclinedMessage),
            )
        }
    })

    return {
        type: 'login-url',
        payload: {
            loginUrl,
        },
    }
}
