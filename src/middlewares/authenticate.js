import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import {UserCollection} from '../db/models/user.js';

export async function authenticate(req, res, next) {
  // const { authenticate } = req.headers;
  const authHeader = req.get('Authorization');
  // if (typeof authenticate !== 'string') {
  //   return next(createHttpError(401, 'Please provide Authorization header'));
  // }
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }


  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }


  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
    
  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }
  // if (new Date() > new Date(session.accessTokenValidUntil)) {
  //   return next(createHttpError(401, 'Access token expired'));
  // };



const user = await UserCollection.findById(session.userId);
if(user === null) {
    return next(createHttpError(401, 'Session not found'));
}
req.user = user;


  next();
};
