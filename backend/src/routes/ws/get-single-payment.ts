import type WebSocket from 'ws'
import { PortalDeamon } from '../../services/portal-deamon.ts'
import type { ErrorMessage, GetSinglePaymentMessage } from './types.ts'
import { TICKETS, type Ticket } from '../../config/tickets.ts'
import { Currency } from 'portal-sdk'

const getTicketFromType = (type: string): Ticket | undefined => {
    return TICKETS.find(ticket => ticket.type === type)
}

export const handleGetSinglePayment = async (ws: WebSocket, data: GetSinglePaymentMessage): Promise<void> => {
    const { payload: { type, pubkey } } = data

    const ticket = getTicketFromType(type)
    if (!ticket) {
        return ws.send(JSON.stringify({
            type: 'error',
            payload: { message: 'Invalid ticket type' },
        } satisfies ErrorMessage))
    }

    const client = await PortalDeamon.getClient()
    await client.requestSinglePayment(pubkey, [], {
        amount: ticket.priceInMillisats,
        currency: Currency.Millisats,
        description: ticket.title,
    }, (status) => {
        console.log('Payment status:', status)
    })
}
