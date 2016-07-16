/**
 * Created by bairnowl on 7/12/16.
 */

var twilio = require("twilio-node/lib");

var accountSid = 'ACd11cce760ddc05c7eef7fe3448030342'; // Your Account SID from www.twilio.com/console
var authToken = '6b7dfc77a039c8d60461a562441fdeb0';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+14016636022',  // Text this number
    from: '+14017533904' // From a valid Twilio number
    }, function(err, message) {

        if(err) {
            console.error(err.message);
        }

        console.log(message.sid);
});