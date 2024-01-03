'use strict'
import express from 'express'
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser'

// 產生大小寫英文和數字字元的陣列
function generateCharacterArray() {
	const upperCaseLetters = [...Array(26)].map((letter, index) =>
		String.fromCharCode(index + 65)
	)
	const lowerCaseLetters = [...Array(26)].map((letter, index) =>
		String.fromCharCode(index + 97)
	)
	const numerals = [...Array(10)].map((num, index) =>
		String.fromCharCode(index + 48)
	)
	return numerals.concat(upperCaseLetters, lowerCaseLetters)
}

// 產生隨機短網址
function createShortenerUrl(link) {
	const charArray = generateCharacterArray()
	let randomChar = ''
	for (let i = 0; i < 5; i++) {
		const indexOfChar = Math.floor(Math.random() * charArray.length) + 1
		randomChar += charArray[indexOfChar]
	}
	const newLink = `${BASE_URL}/${randomChar}`
	return newLink
}

const app = express()
const port = 3000
const BASE_URL = 'https://shortenerurl.com'

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
	const shortenerUrl = createShortenerUrl(longerUrl)
	res.send(shortenerUrl)
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
