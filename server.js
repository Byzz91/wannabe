let express = require('express')
let app = express()
let path = require('path')

app.use('/dist', express.static('dist'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
});

app.get('/_weather.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/_weather.html'))
});

app.listen(7777)