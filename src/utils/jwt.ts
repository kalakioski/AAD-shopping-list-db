import config from 'config';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const privatek = process.env.PRIVATE_KEY;
const publick = process.env.PRIVATE_KEY;

const publicKey = Buffer.from(<string>publick, 'base64').toString('ascii');
const privateKey = Buffer.from(<string>privatek, 'base64').toString('ascii');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, publicKey, {algorithms: ["RS256"]}) as T;
    return decoded;
  } catch (e) {
    console.log(e)
    return null;
  }
}
