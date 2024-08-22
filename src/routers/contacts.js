// import { Router } from 'express';
// import { getAllContacts, getContactById } from '../services/contacts.js';
import express from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';


const router = express.Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.delete('/contacts/:Id', ctrlWrapper(deleteContactController));

router.patch('/contacts/:Id', ctrlWrapper(patchContactController));

export default router;
