const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({req}) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      console.log(`from middleware: ${token}`)
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('no token')
      return req
    }

    // verify token and get user data out of it
    try {
      console.log(`DATA from middleware:`)
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      // return res.status(400).json({ message: 'invalid token!' });
    }

  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    console.log(`from signToken: ${payload}`)
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
