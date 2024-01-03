'use strict'
import express from 'express'

const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.send('Shorten URL web app')
})

app.post('/shorten', (req, res) => {
	res.send('route shorten')
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
