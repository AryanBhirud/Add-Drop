const { sign, verify } = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()
const createTokens = (user) => {
  const accessToken = sign(
    { email: user.email, id: user.student_id },
    process.env.JWT_SECRET
  );

  return accessToken;
};
const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
  
    if (!accessToken)
      return res.render('login');
  
    try {
      const validToken = verify(accessToken, process.env.JWT_SECRET);
      if (validToken) {
        req.authenticated = true;
        return next();
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  };
  
  module.exports = { createTokens, validateToken };