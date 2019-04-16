

// express config
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const route = express.Router();
const cors = require('cors');

// express middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// firebase admin config
var admin = require("firebase-admin");
var serviceAccount = require("./credentials/no-more-truck-stops-firebase-adminsdk-nj3t4-1cfc1e4a2b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://no-more-truck-stops.firebaseio.com"
});

// var registrationToken = "f6Jk3qquZNE:APA91bHayDpXNkmEfjg3qU7wdrBI0JqVMyKv2-e4v-IR16_ch8RD8qO0TRE4qb_3AssMeCIGbUZ8Vn6FlgCpragzhkE09xdgZseDtcDHtq0m92M3y1vSQ_fpysPfAgsAv7w7piGoFLTL";

function sendNotification(registrationToken)
{
var payload = {
    notification: {
      title: "Account Deposit",
      body: "A deposit to your savings account has just cleared."
    }
  };

  admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
} // end sendNotification

// handle post for registration token
app.post('/registrationToken', (req, res)=>{
    console.log('post');
    try{
        var registrationToken = req.body.tokenText;

        sendNotification(registrationToken);
    }
    catch(err){
        console.log('Failed to parse token from POST', err);
    }
    res.end();
}); // end POST /registrationToken

// start server
app.listen(PORT, ()=>{
    console.log('Server running on port ', PORT);
});

  