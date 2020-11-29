let express = require('express')
let app = express()
let path = require('path')

app.use('/dist', express.static('dist'))
app.use('/assets', express.static('assets'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
});

/**
 * 오늘의 날씨 - 위젯 페이지
 */
app.get('/widget/weather.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/widget/weather.html'))
});

/**
 * 오늘의 명언 - 위젯 페이지
 */
app.get('/widget/maxim.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/widget/maxim.html'))
})

/**
 * 오늘의 명언 - 데이터 파일 
 */
app.get('/widget/maxim.json', function (req, res) {
    res.sendFile(path.join(__dirname + '/widget/maxim.json'))
})

/**
 * 오늘의 명언 - 위젯 페이지
 */
app.get('/widget/news.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/widget/news.html'))
})

/**
 * 코스피 위젯
 */
app.get('/widget/finance.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/widget/finance.html'))
})

app.listen(7777)