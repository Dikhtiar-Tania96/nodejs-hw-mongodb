import createHttpError from 'http-errors';
import { 
  getAllContacts, 
  getContactById 
} from '../services/contacts.js';

export async function getContactsController(req, res) {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact no found!');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!!!`,
    data: contact,
  });
}
