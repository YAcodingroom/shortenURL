'use strict'
import express from 'express'
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser'
import { createRequire } from 'module'
import fs from 'fs'
import qr from 'qr-image'

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
	let matchedUrl = ''
	// 比對輸入的長網址
	matchedUrl = compareUrl(link, urls)
	if (matchedUrl.length !== 0) {
		return matchedUrl[0].shortenerUrl
	} else {
		const charArray = generateCharacterArray()
		let newLink = `${BASE_URL}/`
		do {
			let randomChar = ''
			for (let i = 0; i < 5; i++) {
				const indexOfChar = Math.floor(Math.random() * charArray.length) + 1
				randomChar += charArray[indexOfChar]
			}
			newLink += randomChar
			// 比對是否產生重複短網址
			matchedUrl = compareUrl(newLink, urls)
		} while (matchedUrl === true)

		createQrCodeImage(link)
		writeJsonData(link, newLink)
		return newLink
	}
}

// 比對是否輸入過此長網址 或是產生重複短網址
function compareUrl(link, datas) {
	const alertText = `The url: ${link} is been used`
	const matchedLink = datas.filter((data) => {
		if (data.longerUrl === link) {
			console.log(alertText)
			return data.shortenerUrl
		} else if (data.shortenerUrl === link) {
			return true
		}
	})
	return matchedLink
}

// 將 URL 資料寫入 json 檔
function writeJsonData(longerUrl, shortenerUrl) {
	const jsonDir = './public/jsons'
	const urlsData = !urls.length ? JSON.parse(urls) : urls
	urlsData.push({ longerUrl, shortenerUrl })

	const json = JSON.stringify(urlsData)
	fs.writeFile(`${jsonDir}/shortenerUrl.json`, json, (err) => {
		if (err) {
			console.log(err)
		} else {
			console.log('Writing success')
		}
	})
}

// 產生 QR code 圖片
function createQrCodeImage(link) {
	const qrCodeImage = qr.image(link)
	const qrImgDir = './public/qrcodeImages'
	qrCodeImage.pipe(fs.createWriteStream(`${qrImgDir}/qrCode.png`))
}

const app = express()
const port = 3000
const BASE_URL = 'https://shortenerurl.com'
const require = createRequire(import.meta.url)
const urls = require('./public/jsons/shortenerUrl.json')

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
	const qrCodeImagePath = './qrcodeImages/qrCode.png'
	res.render('result', { longerUrl, shortenerUrl, qrCodeImagePath })
})

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`)
})
