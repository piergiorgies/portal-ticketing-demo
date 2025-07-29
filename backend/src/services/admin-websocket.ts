import type WebSocket from 'ws';

export class AdminWebSocketManager {
    private static instance: AdminWebSocketManager | null = null;
    private connections: WebSocket[];

    private constructor() {
        this.connections = [];
    }

    public static getInstance(): AdminWebSocketManager {
        if(!AdminWebSocketManager.instance) {
            AdminWebSocketManager.instance = new AdminWebSocketManager();
        }

        return AdminWebSocketManager.instance;
    }

    public addConnection(connection: WebSocket) {
        this.connections.push(connection);
    }

    public broadcast(message: string) {
        const connectionsToDelete: number[] = [];
        
        for(let i = 0; i < this.connections.length; i++) {
            const connection = this.connections[i];

            try {
                connection.send(message);
            } catch(error) {
                console.log('Error while broadcasting to admin websocket: ', error);
                connectionsToDelete.push(i);
            }
        }

        this.connections = this.connections.filter((_, i) => !connectionsToDelete.includes(i))
    }
}