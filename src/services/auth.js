import crypto from 'node:crypto';
// import { randomBytes } from 'node:crypto';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY,
  // SMTP
} from '../constants/index.js';
// import {sendEmail} from '../utils/sendEmail.js';
// import { env } from '../utils/env.js';

export async function registerUser(payload) {
  const maybeUser = await UserCollection.findOne({ email: payload.email });
  if (maybeUser !== null) {
    throw createHttpError(409, 'Email in use'); //користувач вже є
  }

  payload.password = await bcrypt.hash(payload.password, 10); //хешування паролю

  return UserCollection.create(payload);

  // const encrypterdPassword = await bcrypt.hash(payload.password, 10); //хешування паролю
  // return await UserCollection.create({
  //   ...payload,
  //   password: encrypterdPassword,
  // });
}

// //функціонал логіну - аудентифікація
export async function loginUser(email, password) {
  const maybeUser = await UserCollection.findOne({ email });
  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
    //якщо користувач хоче залогінитись,але його немає у базі
  }
  const isMatch = await bcrypt.compare(password, maybeUser.password);
  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
    //якщо паролі не співпадають
  }

  await SessionCollection.deleteOne({ userId: maybeUser._id });

  //створити нову сесію
  return SessionCollection.create({
    userId: maybeUser._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });
}

// //Видалення
export function logoutUser(sessionId) {
  return SessionCollection.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  };

 if (new Date() > new Date(session.refreshTokenValidUntil)){
      throw createHttpError(401, 'Session token expired');
 }
   await SessionCollection.deleteOne({ _id: sessionId });




  //створити нову сесію після видалення попередньої
  return SessionCollection.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });
  }

