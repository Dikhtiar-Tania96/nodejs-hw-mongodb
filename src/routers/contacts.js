// import { Router } from 'express';
// import { getAllContacts, getContactById } from '../services/contacts.js';
import express from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';

import {
  getContactsController,
  getContactByIdController,
  createContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContact));
export default router;
