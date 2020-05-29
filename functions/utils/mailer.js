/* eslint-disable no-console */
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const sendEmail = (opts) => {
  const mailOptions = {
    to: gmailEmail,
    ...opts,
  };

  return mailTransport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error while sending the email:', err);
      throw err;
    }
    console.log('Email sent with ID:', info.messageId);
    // console.log(info.envelope);
  });
};

module.exports = sendEmail;
