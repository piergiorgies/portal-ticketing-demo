import { app } from './app.js'
import { handleWebsocketConnection } from './ws.js';

app.ws('/ws', (ws, _) => {
    handleWebsocketConnection(ws);
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})
