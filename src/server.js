import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));
// const PORT = Number(env('PORT'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res, next) => {
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

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null
      });
    };
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
    } catch (error) {
      next(error);
    };
  });
 

  app.use(( req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Not found',
      data: null
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: { error: err.message }
    });
  });
  

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
  });
};





