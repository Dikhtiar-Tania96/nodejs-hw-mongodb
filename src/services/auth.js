import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';

export async function registerUser(payload) {
  const maybeUser = await UserCollection.findOne({ email: payload.email });

  if (maybeUser !== null) {
    throw createHttpError(409, 'Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return UserCollection.create(payload);

}
