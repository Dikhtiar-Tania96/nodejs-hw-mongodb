import crypto, { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY,
} from '../constants/index.js';

export async function registerUser(payload) {
  const maybeUser = await UserCollection.findOne({ email: payload.email });
  if (maybeUser !== null) {//користувач вже є
    throw createHttpError(409, 'Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10); //хешування паролю
  return UserCollection.create(payload);
}

//функціонал логіну - аудентифікація
export async function loginUser(email, password) {
  const maybeUser = await UserCollection.findOne({ email });
  if (!maybeUser) {
    throw createHttpError(404, 'User not found');
    //якщо користувач хоче залогінитись,але його немає у базі
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);
  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
    //якщо паролі не співпадають
  }



  await SessionCollection.deleteOne({ userId: maybeUser._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: maybeUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });
}

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

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

  await SessionCollection.deleteOne({_id: sessionId});
  return await SessionCollection.create({
    userId: session._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken:crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });
};

 


// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   // console.log('Проверка сессии:', { sessionId, refreshToken });
//   const session = await SessionCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });
//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }};
