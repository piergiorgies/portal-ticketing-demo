import express from 'express'
import expressWs from 'express-ws'

export const { app } = expressWs(express());

app.get('/', (req, res) => {
    res.send('Hello World!')
})
