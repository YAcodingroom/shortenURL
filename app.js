'use strict'
import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.send('Shorten URL web app')
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
