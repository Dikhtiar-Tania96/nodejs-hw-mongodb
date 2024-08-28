import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';

export async function registerUser(payload) {
  const maybeUser = await UserCollection.findOne({ email: payload.email });

  if (maybeUser !== null) {
    throw createHttpError(409, 'Email in use');
  }

  return UserCollection.create(payload);

}
