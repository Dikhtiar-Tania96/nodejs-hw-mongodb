import express from 'express';
import { getAllContacts, getContactById } from './services/contacts.js';

const router = express.Router();


router.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status:200, 
        data:contacts,
        message: 'Successfully found contacts!'});
    } catch (error) {
      next(error);
    }
  });

  router.get('/contacts/:contactId', async (req, res, next) => {
    try {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
    };
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!!!`,
      data: contact,
    });
    } catch (error) {
      next(error);
    };
  });
 

  router.use(( req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Not found',
      data: null
    });
  });

  router.use((err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: { error: err.message }
    });
  });
  


export default router;