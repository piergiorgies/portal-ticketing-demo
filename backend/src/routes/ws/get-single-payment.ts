import type WebSocket from 'ws'
import { PortalDeamon } from '../../services/portal-deamon.ts'
import type { ErrorMessage, GetSinglePaymentMessage, MintTokenRequest } from './types.ts'
import { TICKETS, type Ticket } from '../../config/tickets.ts'
import { Currency } from 'portal-sdk'
import { env } from '../../config/env.ts'

const getTicketFromType = (type: string): Ticket | undefined => {
    return TICKETS.find((ticket) => ticket.type === type)
}

export const handleGetSinglePayment = async (
    ws: WebSocket,
    data: GetSinglePaymentMessage,
): Promise<void> => {
    const {
        payload: { type, pubkey },
    } = data

    const ticket = getTicketFromType(type)
    if (!ticket) {
        return ws.send(
            JSON.stringify({
                type: 'error',
                payload: { message: 'Invalid ticket type' },
            } satisfies ErrorMessage),
        )
    }

    const client = await PortalDeamon.getClient()
    const jwt = await client.issueJwt(pubkey, 24)
    await client.requestSinglePayment(
        pubkey,
        [],
        {
            amount: ticket.priceInMillisats,
            currency: Currency.Millisats,
            description: ticket.title,
            auth_token: jwt,
        },
        async (status) => {
            console.log('Payment status:', status.status)
            if (status.status === 'user_approved') {
                // facciamo finta che l'utente ha pagato
                // quindi mintiamo il token e lo mandiamo alla pubkey                
                const client = await PortalDeamon.getClient()
                const token = await client.mintCashu(
                    env.CASHU_URL,
                    env.CASHU_TOKEN,
                    'lido',
                    1,
                    ''
                );
            
                await client.sendCashuDirect(pubkey, [], token)

                ws.send(JSON.stringify({
                    type: 'single-payment',
                    payload: {
                        status: 'paid',
                    }
                }))
            } else if(!['paid', 'user_success'].includes(status.status)) {
                // facciamo finta che il pagamento è stato rifiutato o fallito
                ws.send(
                    JSON.stringify({
                        type: 'error',
                        payload: { message: 'Payment failed or declined' },
                    } satisfies ErrorMessage),
                )
            }
        },
    )
}
