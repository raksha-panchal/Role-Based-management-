const express = require('express');
const app = express();
var config = require('./config.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
var useraction = require('./useraction')
app.use(bodyParser.json());
mongoose.connect(config.URL)

app.post('/signup', (req, res) => {
    useraction.signup(req, res)
})
app.post('/login', (req, res) => {
    useraction.login(req, res)
})
app.get('/view/:id', (req, res) => {
    useraction.view(req, res)
})

app.post('/update/:id/:updateid', (req, res) => {
    useraction.update(req, res)
})

app.post('/deleteUser/:id/:deleteid', (req, res) => {
    useraction.deleteUser(req, res)
})
app.post('/imageupload1', (req, res) => {
    useraction.imageupload1(req, res)
})
app.listen(config.port, () => {
    console.log(`app listening on  ${config.port}`)
})

