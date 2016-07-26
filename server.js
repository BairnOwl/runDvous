/**
 * Created by bairnowl on 7/12/16.
 */

var accountSid = 'ACd11cce760ddc05c7eef7fe3448030342'; // Your Account SID from www.twilio.com/console
var authToken = '6b7dfc77a039c8d60461a562441fdeb0';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.static('public'));

var fs = require('fs');

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var clientSocket;

io.sockets.on('connection', function(socket) {

    clientSocket = socket;

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

    res.json(customers);
});

app.post('/incoming', function(req, res) {
    var phoneNumber = req.body.From;
    var choice = parseInt(req.body.Body);
    console.log(choice);

    if (!isNaN(choice)) {
        if (choice == 1 || choice == 2 || choice == 3 || choice == 4) {
            console.log('sending to client');
            clientSocket.emit('addStatus', phoneNumber, choice);
        } else {
            sendErrorMessage(phoneNumber);
        }
    } else {
        sendErrorMessage(phoneNumber);
    }
});

app.post('/file-upload', function(req, res) {
    console.log(req.files);
    res.render('schedule.html');
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

function sendInitialMessage(name, phoneNumber, ETA) {
    client.messages.create({
        body: 'Hi, ' + name + '! Your package will arrive today around ' + ETA + '. ' +
        'Are you home at this time? Reply: 1 for YES, 2 for NO (come back another day), ' +
        '3 for NO (leave my package outside), and 4 for NO (send to my neighbor)',
        to: phoneNumber,  // Text this number
        from: '+14017533904' // From a valid Twilio number
    }, function (err, message) {
        if (err) {
            console.error(err.message);
        }
    });

    // client.messages.create({
    //     body: 'Are you home at this time? Reply: 1 for YES, 2 for NO (come back another day), 3 for NO (leave my package outside), and 4 for NO (send to my neighbor)',
    //     to: phoneNumber,  // Text this number
    //     from: '+14017533904' // From a valid Twilio number
    // }, function (err, message) {
    //     if (err) {
    //         console.error(err.message);
    //     }
    // });
}

function sendErrorMessage(phoneNumber) {
    client.messages.create({
        body: 'Please input the number 1, 2, 3, or 4',
        to: phoneNumber,
        from: '+14017533904'
    }, function (err, message) {
        if (err) {
            console.error(err.message);
        }
    });
}


server.listen(process.env.PORT, function () {
    console.log('runDvous app listening on port ' + process.env.PORT);
});