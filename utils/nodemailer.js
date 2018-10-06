const nodemailer = require('nodemailer');
const { google } = require('googleapis');
//Defining a function to get the access token when it expires
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    "343833076140-995cnklgnkddhte6ea5v5fo47hbhg7jm.apps.googleusercontent.com", //client id
    "_KGDACP7LsffojcISKTHoRWg", //client secret
    "https://developers.google.com/oauthplayground" //redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1/c6BE2nOGA0KRNwpZCMjBydLzrGYOCBbAtegVubj8YWQ"
});

const accessToken = oauth2Client.refreshAccessToken()
    .then( res => res.credentials.access_token);

let tokenNotifier = function (fromEmail, toEmail, toName, code , page = "") {
    let poolConfig = {
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'oauth2',
            user: 'orionghana.io@gmail.com',
            clientId: '343833076140-995cnklgnkddhte6ea5v5fo47hbhg7jm.apps.googleusercontent.com',
            clientSecret: '_KGDACP7LsffojcISKTHoRWg',
            refreshToken: '1/c6BE2nOGA0KRNwpZCMjBydLzrGYOCBbAtegVubj8YWQ',
            accessToken: accessToken,
            expires: 3600
        }
    };

    let transporter = nodemailer.createTransport(poolConfig);
    let message = {
        from: fromEmail,
        to: toEmail,
        subject: 'Accounts Activation Code',
        html: "<h3> Hi " + toName + ",</h3><br/><p>Thank you for " + page +" for Coin Wrapper - An intuitive exchange platform.</p><p>Please you this link " + process.env.APP_PROD_URL + "/api/v1/user/authorize/" + toEmail + "?token=" + code + " to log into  your accounts. Once your accounts is activated , \
		you can enjoy all the amazing experience that comes with <strong>Coin Wrapper</strong>\
		 </p>",
        replyTo: 'no-reply@orionic.tech'
    };
    transporter.sendMail(message, function (err, info) {
        if (!err) {
            console.log(info)
        } else {
            console.log(err);
        }
    });


};

module.exports = tokenNotifier;