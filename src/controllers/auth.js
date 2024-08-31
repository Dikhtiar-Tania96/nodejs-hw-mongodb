import { registerUser, loginUser } from '../services/auth.js';

export async function registerUserController(req, res) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  
  const registeredUser = await registerUser(user);
  res.send({status: 201, message: "Successfully registered a user!", data: registeredUser});
};

export async function loginUserController(req, res) {
    const {email, password} = req.body;
    const session = await loginUser(email, password);
    console.log(session);

    //cookies
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.send({
      status: 200,
      message: 'Login completed',
      data: {
        accessToken: session.accessToken
      }
    });
}