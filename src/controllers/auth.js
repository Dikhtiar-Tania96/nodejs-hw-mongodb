import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

//hw7
import { generateAuthUrl } from '../utils/googleOAuth2.js';
// import { loginOrSignupWithGoogle } from '../services/auth.js';
import '../utils/googleOAuth2.js';

//Реєстрація користувача
export async function registerUserController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);
  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
}

// LOGIN
export async function loginUserController(req, res) {
  const { email, password } = req.body;
  await loginUser(email, password);
  const session = await loginUser(email, password);
  console.log(session);

  //cookies
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
//

//завершити користування у системі
export async function logoutUserController(req, res) {
  const { sessionId } = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.send(204).end();
}

export async function refreshUserController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUserSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
  res.send('Refresh!!!');
}

//6hw
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

//hw7
// export const getGoogleOAuthUrlController = async (req, res) => {
//   const url = generateAuthUrl();
//   res.json({
//     status: 200,
//     message: 'Successfully get Google OAuth url!',
//     data: {
//       url,
//     },
//   });
// };

// export const loginWithGoogleController = async (req, res) => {
//   const session = await loginOrSignupWithGoogle(req.body.code);
//   // setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully logged in via Google OAuth!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

export async function getOAuthUrlController(req, res) {

  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: { url},
  });
}
