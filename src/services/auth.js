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


// const createSession = () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');
//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
//     refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
//   };
// };

// export const refreshUserSession = async ({ sessionId, refreshToken }) => {
//   console.log('Перевірка сесії:', { sessionId, refreshToken });
//
//
//
//   const newSession = createSession();
//   await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
//   return await SessionCollection.create({
//     userId: session.userId,
//     ...newSession,
//   });
// };

// export async function refreshUserSession(sessionId, refreshToken) {
//   const session = await SessionCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });
//   if (session === null) {
//     throw createHttpError(401, 'Session not found');
//   };
//   if (new Date() > new Date(session.refreshTokenValidUntil)){
//       throw createHttpError(401, 'Session token expired');
//   }

//   await SessionCollection.deleteOne({_id: sessionId});
//   return  SessionCollection.create({
//     userId: session._id,
//     accessToken: crypto.randomBytes(30).toString('base64'),
//     refreshToken:crypto.randomBytes(30).toString('base64'),
//     accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
//     refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
//   });
// };

// export const requestResetToken = async (email) => {
//   const user = await UsersCollection.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   const resetToken = jwt.sign(
//     {
//       sub: user._id,
//       email,
//     },
//     env('JWT_SECRET'),
//     {
//       expiresIn: '15m',
//     },
//   );

//   const resetPasswordTemplatePath = path.join(
//     TEMPLATES_DIR,
//     'reset-password.html',
//   );

//   const templateSource = (
//     await fs.readFile(resetPasswordTemplatePath)
//   ).toString();

//   const template = handlebars.compile(templateSource);
//   const html = template({
//     name: user.name,
//     link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
//   });

//   await sendEmail({
//     from: env(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html,
//   });
// };

// export const resetPassword = async (payload) => {
//   let entries;

//   try {
//     entries = jwt.verify(payload.token, env('JWT_SECRET'));
//   } catch (err) {
//     if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
//     throw err;
//   }

//   const user = await UsersCollection.findOne({
//     email: entries.email,
//     _id: entries.sub,
//   });

//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }

//   const encryptedPassword = await bcrypt.hash(payload.password, 10);

//   await UsersCollection.updateOne(
//     { _id: user._id },
//     { password: encryptedPassword },
//   );
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   // console.log('Проверка сессии:', { sessionId, refreshToken });
//   const session = await SessionCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });
//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }};
