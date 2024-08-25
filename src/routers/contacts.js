// import { Router } from 'express';
// import { getAllContacts, getContactById } from '../services/contacts.js';
import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import {isValidId} from '../middlewares/isValidId.js';

import {validateBody} from '../middlewares/validateBody';
import {createContactsSchema} from '../validation/contacts.js';

import {ctrlWrapper} from '../utils/ctrlWrapper.js';



const router = express.Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/contacts', validateBody(createContactsSchema), ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', isValidId, ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));


export default router;
