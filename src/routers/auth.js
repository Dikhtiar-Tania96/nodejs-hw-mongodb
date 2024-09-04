import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  requestResetEmailController
} from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

//реєстрація користувача
router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

//вхід користувача
router.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default router;
