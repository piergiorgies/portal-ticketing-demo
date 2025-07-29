import type WebSocket from 'ws'
import { PortalDeamon } from '../../services/portal-deamon.ts'
import type {
    LoginApprovedMessage,
    LoginDeclinedMessage,
    LoginUrlMessage,
} from './types.ts'
import { env } from '../../config/env.ts'

const adminKeys = env.ADMIN_PUB_NOSTR_KEY.split(',')

export const handleGetLoginUrl = async (ws: WebSocket) => {
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
                        isAdmin: adminKeys.includes(mainKey),
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

    ws.send(
        JSON.stringify({
            type: 'login-url',
            payload: {
                loginUrl,
            },
        } satisfies LoginUrlMessage),
    )
}
