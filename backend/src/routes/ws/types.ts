import type WebSocket from 'ws'
import type { Ticket } from '../../config/tickets.ts'

export type WebSocketRouterCallback = (
    ws: WebSocket,
    event: WebSocketMessage,
) => Promise<void>

export type GetLoginUrlMessage = {
    type: 'get-login-url'
    payload: {}
}

export type MintTokenRequest = {
    type: 'mint-token',
    payload: {
        pubkey: string;
    }
}

export type LoginUrlMessage = {
    type: 'login-url'
    payload: {
        loginUrl: string
    }
}

export type LoginApprovedMessage = {
    type: 'login-approved'
    payload: {
        token: string
        pubkey: string
        isAdmin: boolean
    }
}

export type LoginDeclinedMessage = {
    type: 'login-declined'
    payload: {}
}

export type GetSinglePaymentMessage = {
    type: 'get-single-payment'
    payload: {
        type: Ticket['type']
        pubkey: string
    }
}

export type ErrorMessage = {
    type: 'error'
    payload: {
        message: string
    }
}

export type WebSocketMessage = GetLoginUrlMessage | GetSinglePaymentMessage | MintTokenRequest
