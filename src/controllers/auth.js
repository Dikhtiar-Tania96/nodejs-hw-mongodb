import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail
} from '../services/auth.js';


// import { resetPassword } from '../services/auth.js';


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
//LOGIN
export async function loginUserController(req, res) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);
  // console.log(session);

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

//завершити користування у системі
export async function logoutUserController(req, res) {
  const { sessionId } = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  // console.log(req.cookies);
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
};

export async function requestResetEmailController(req, res) {
  const {email} = req.body;
  await requestResetEmail(email);

  res.send({
    status: 200,
    message: "Reset email was send seccessfully",
    data: {}
  });
}; 

// export const resetPasswordController = async (req, res) => {
//   await resetPassword(req.body);
//   res.json({
//     message: 'Password was successfully reset!',
//     status: 200,
//     data: {},
//   });
// };