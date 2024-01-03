'use strict'
import express from 'express'
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/shorten', (req, res) => {
	const longerUrl = req.body.url
	res.send(longerUrl)
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
