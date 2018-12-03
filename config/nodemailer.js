'use strict';
const nodemailer = require('nodemailer');
const mail = require('./mail');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    auth: {
      user: mail.auth.user,
      pass: mail.auth.pass
    }
});

// setup email data with unicode symbols
function mailOptions(from, name, subject, output) {
    return {
        from: `"${name}" <${from}>`, // sender address
        to: 'contact@myblog.com', // list of receivers
        subject: subject, // Subject line
        text: '', // plain text body
        html: output // html body
    }
}

module.exports = {transporter, mailOptions}