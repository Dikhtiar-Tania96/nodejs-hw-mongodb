// import { Router } from 'express';
// import { getAllContacts, getContactById } from '../services/contacts.js';
import express from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.js';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));

export default router;
