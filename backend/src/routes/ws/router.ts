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
    public routes: Map<string, WebSocketRouterCallback>;

    public constructor() {
        this.routes = new Map();
    }

    public register(route: string, callback: WebSocketRouterCallback) {
        this.routes.set(route, callback);
    }

    public async route(route: string, data: WebSocketMessage, ws: WebSocket) {
        if(this.routes.has(route)) {
            await this.routes.get(route)!(ws, data);
        }
    }
}