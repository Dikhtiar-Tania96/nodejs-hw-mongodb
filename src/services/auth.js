import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {REFRESH_TOKEN_EXPIRY, ACCESS_TOKEN_EXPIRY} from '../constants/index.js';


export async function registerUser(payload) {
  const maybeUser = await UserCollection.findOne({ email: payload.email });
  if (maybeUser !== null) {
    throw createHttpError(409, 'Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10); //хешування паролю
  return UserCollection.create(payload);
}

export async function loginUser(email, password) {
  const maybeUser = await UserCollection.findOne({ email });
  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);
  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: maybeUser._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: maybeUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });
}
