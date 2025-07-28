import WebSocket from 'ws'

export type GetLoginUrlMessage = {
    type: 'get-login-url'
    payload: {}
}

export type LoginUrlMessage = {
    type: 'login-url'
    payload: {
        loginUrl: string
    }
}

export type ErrorMessage = {
    type: 'error'
    payload: {
        message: string
    }
}

export type WebSocketMessage = GetLoginUrlMessage | LoginUrlMessage | ErrorMessage
export type WebSocketRouterCallback = (ws: WebSocket, event: WebSocketMessage) => Promise<void>;

export default class WebSocketRouter {
    private readonly routes: Map<string, WebSocketRouterCallback>

    constructor() {
        this.routes = new Map()
    }

    public register(route: string, callback: WebSocketRouterCallback) {
        this.routes.set(route, callback)
    }

    public async handle(data: WebSocketMessage, ws: WebSocket) {
        const handler = this.routes.get(data.type)
        if (handler) {
            await handler(ws, data)
        }
    }
}
