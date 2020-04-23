import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, resp, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return resp.status(401).json({ error: 'Token not provider' });
  }
  const [, token] = headerToken.split(' ');

  try {
    const decode = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decode.id;

    return next();
  } catch (error) {
    return resp.status(401).json({ error: 'Token invalid' });
  }
};
