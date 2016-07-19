/**
 * Created by bairnowl on 7/12/16.
 */

var accountSid = 'ACd11cce760ddc05c7eef7fe3448030342'; // Your Account SID from www.twilio.com/console
var authToken = '6b7dfc77a039c8d60461a562441fdeb0';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

var express = require('express');
var app = express();

var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var fs = require('fs');

app.get('/', function (req, res) {
    readInfo();
    res.render('index.html');
});

function readInfo() {
    fs.readFile('test.txt', function (err, data) {
        if (err) {
            console.log('Can\'t read file');
        }

        var array = data.toString().split("\n");

        for (i in array) {
            console.log(array[i] + '\n');
        }
    });
}

function sendMessage(phoneNum) {

    client.messages.create({
        body: 'Hello from Linda. Heroku test',
        to: '+1' + phoneNum,  // Text this number
        from: '+14017533904' // From a valid Twilio number
    }, function (err, message) {

        if (err) {
            console.error(err.message);
        }

        console.log('message sent');
    });
}


app.listen(process.env.PORT, function () {
    console.log('runDvous app listening on port ' + process.env.PORT);
});