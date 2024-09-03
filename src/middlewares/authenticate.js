import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;
  console.log(authorization);
  if (typeof authenticate !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, accessToken] = authenticate.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  //перевірка чи існує сесія
  const session = await SessionCollection.findOne({ accessToken });
  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  //шукаємо користувача по сесії
  const user = await UserCollection.findById(session.userId);
  if (user === null) {
    return next(createHttpError(401, 'Session not found'));
  }
  req.user = user;

  next();
}
