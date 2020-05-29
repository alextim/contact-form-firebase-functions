const getRemoteIP = (req) => (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
  || req.connection.remoteAddress
  || req.socket.remoteAddress
  || req.connection.socket.remoteAddress;

const sanitizeHtml = (val) => val.replace(/<(.|\n)*?>/g, '');

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
  return re.test(String(email).toLowerCase());
};

module.exports = { getRemoteIP, sanitizeHtml, validateEmail };
