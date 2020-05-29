/* eslint-disable no-console */
const functions = require('firebase-functions');
const cors = require('cors')({
  origin: '*',
  methods: 'POST',
  allowedHeaders: 'Content-Type',
});

const utils = require('./utils/helpers');
const sendEmail = require('./utils/mailer');
const db = require('./utils/db');

const EMAIL_FIELD = 'tvtqk';
const NAME_LENGTH = 40;
const EMAIL_LENGTH = 254;
const MESSAGE_LENGTH = 256;

const isSpam = (req) => req.body.email;

const sanitizeEmail = (val) => {
  if (!val) {
    return false;
  }
  const sanitized = utils.sanitizeHtml(val.substr(0, EMAIL_LENGTH - 1));
  return utils.validateEmail(sanitized) ? sanitized : false;
};

const sanitizeName = (val) => (val ? utils.sanitizeHtml(val.substr(0, NAME_LENGTH - 1)) : false);

const sanitizeMessage = (val) => (
  val ? utils.sanitizeHtml(val.substr(0, MESSAGE_LENGTH - 1)) : false
);

const sanitize = (req) => {
  if (!req.body) {
    return false;
  }
  const name = sanitizeName(req.body.name);
  if (!name) {
    return false;
  }
  const email = sanitizeEmail(req.body[EMAIL_FIELD]);
  if (!email) {
    return false;
  }
  const message = sanitizeMessage(req.body.message);
  if (!message) {
    return false;
  }
  return { name, email, message };
};

exports.contact = functions.https.onRequest((req, res) => cors(req, res, () => {
  if (req.method !== 'POST') {
    return res.status(403).send('Forbidden!');
  }

  if (isSpam(req)) {
    return res.status(403).send('Spam');
  }

  const sanitized = sanitize(req);
  if (!sanitized) {
    return res.status(400).send('Bad data');
  }

  const data = {
    ip: utils.getRemoteIP(req),
    time: new Date(),
    ...sanitized,
  };

  const { email, name, message } = sanitized;
  const mailOptions = {
    from: email,
    replyTo: email,
    subject: `${name} just messaged me from my website`,
    text: message,
    html: `<p>${message}</p>`,
  };

  const emailsRef = db.collection('emails');
  return emailsRef.add(data)
    .then((docRef) => console.log('Document added with ID:', docRef.id))
    .then(() => sendEmail(mailOptions))
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err });
    });
}));
