import { registerUser } from '../services/auth.js';

export async function registerUserController(req, res) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  
  const registeredUser = await registerUser(user);
  res.send({status: 201, message: "Successfully registered a user!", data: registeredUser});
};
