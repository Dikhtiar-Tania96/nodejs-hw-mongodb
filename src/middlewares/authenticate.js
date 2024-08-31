import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import {UserCollection} from '../db/models/user.js';
export async function authenticate(req, res, next) {
  const { authenticate } = req.headers;

  if (typeof authenticate !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }
  // const authHeader = req.get('Authorization');

  // if (!authHeader) {
  //   next(createHttpError(401, 'Please provide Authorization header'));
  //   return;
  // };

  const [bearer, accessToken] = authenticate.split(' ', 2);
  // const bearer = authHeader.split(' ')[0];
  // const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (session === null) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  };

const user = await UserCollection.findById(session.userId);
if(user === null) {
    return next(createHttpError(401, 'Session not found'));
}
req.user = user;


  next();
}
