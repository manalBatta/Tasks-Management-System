// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// مفتاح سري للتوقيع JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = function (req, res, next) {
  // الحصول على التوكن من الهيدر
  const token = req.header('x-auth-token');

  // التحقق من وجود التوكن
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // إضافة بيانات المستخدم إلى الطلب
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};