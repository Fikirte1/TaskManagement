import jwt from 'jsonwebtoken';
import User from '../models/auth/User.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization' header
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next(); // Continue with the request
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
