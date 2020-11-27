let express = require('express')
let app = express()
let path = require('path')

app.use('/dist', express.static('dist'))
app.use('/assets', express.static('assets'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
});

app.get('/widget/weather.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/widget/weather.html'))
});

app.listen(7777)