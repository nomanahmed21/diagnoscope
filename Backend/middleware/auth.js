const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get token from cookie or authorization header
  console.log(req.cookies)
  const token = req.cookies.token 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
    req.user = decoded.id; // save user info in request
    next(); // continue to next middleware/route
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

module.exports = authMiddleware;
