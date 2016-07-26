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

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    socket.on('message', function(customerInfo) {
        for (var i in customerInfo) {
         sendInitialMessage(customerInfo[i]['name'], customerInfo[i]['phoneNumber'], customerInfo[i]['ETA']);
        }
    });
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/schedule', function(req, res) {

    res.render('schedule.html');
});

app.get('/schedule/data', function(req, res) {
    var customers = readInfo();

    // for (var i = 0; i < customers.length; i++) {
    //     phoneNumbers.push(customers[i]['phoneNumber']);
    // }

    res.json(customers);
});

app.post('/incoming', function(req, res) {
    console.log('incoming: ' + req.params.From + ', ' + res.params.From);
});

app.post('/file-upload', function(req, res) {
    console.log('uploading file');
});

function readInfo() {

    var array = fs.readFileSync('test.txt').toString().split("\n");
    var customers = [];

    for (var i in array) {

        var info = array[i].split(";");

        customers.push({
            name: info[0],
            address: info[1],
            phoneNumber: info[2]
        });
    }

    return customers;
}

function sendMessage(phoneNum) {

    client.messages.create({
        body: 'moar tests',
        to: phoneNum,  // Text this number
        from: '+14017533904' // From a valid Twilio number
    }, function (err, message) {

        if (err) {
            console.error(err.message);
        }

        console.log('message sent');
    });
}

function sendInitialMessage(name, phoneNumber, ETA) {
    client.messages.create({
        body: 'Hi, ' + name + '! Your package will arrive today around ' + ETA,
        to: phoneNumber,  // Text this number
        from: '+14017533904' // From a valid Twilio number
    }, function (err, message) {
        if (err) {
            console.error(err.message);
        }
    });

    client.messages.create({
        body: 'Are you home at this time? Reply: 1 for YES, 2 for NO (come back another day), 3 for NO (leave my package outside), and 4 for NO (send to my neighbor)',
        to: phoneNumber,  // Text this number
        from: '+14017533904' // From a valid Twilio number
    }, function (err, message) {
        if (err) {
            console.error(err.message);
        }
    });
}


server.listen(process.env.PORT, function () {
    console.log('runDvous app listening on port ' + process.env.PORT);
});