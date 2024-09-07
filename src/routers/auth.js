import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  // loginWithGoogleOAuthSchema
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  requestResetEmailController,
  resetPasswordController,
  // getGoogleOAuthUrlController,
  // loginWithGoogleController
} from '../controllers/auth.js';

// import { loginWithGoogleOAuthSchema } from '../validation/auth.js';
// import { loginWithGoogleController } from '../controllers/auth.js';

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


//6hw
router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-password',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

// router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController ));


// router.post(
//   '/confirm-oauth',
//   validateBody(loginWithGoogleOAuthSchema),
//   ctrlWrapper(loginWithGoogleController),
// );
export default router;
