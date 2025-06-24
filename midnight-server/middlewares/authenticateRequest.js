import jwt from "jsonwebtoken";


export const authenticateRequest = (req, res, next) => {
  const SECRET_KEY = process.env.SECRET;
  const token = req.headers.authorization;
  
  if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden: Token invalid" });
    req.user = decoded.username;
    next();
  });
};