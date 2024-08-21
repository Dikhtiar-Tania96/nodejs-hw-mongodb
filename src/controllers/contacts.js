import { getAllContacts, getContactById } from '../services/contacts.js';


export async function getContactsController(req, res) {
          const contacts = await getAllContacts();
          res.status(200).json({
            status:200, 
            data:contacts,
            message: 'Successfully found contacts!'});
      };



export async function getContactByIdController(req, res) {
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
  };
