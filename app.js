'use strict'
import express from 'express'
import { engine } from 'express-handlebars'

const app = express()
const port = 3000

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/shorten', (req, res) => {
	res.send('route shorten')
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
