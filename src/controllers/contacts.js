import createHttpError from 'http-errors';
import { 
  getAllContacts, 
  getContactById,
  createContact,
  deleteContact,
  patchContactEmail,
} from '../services/contacts.js';

export async function getContactsController(req, res) {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
};

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);


  // app.use(function (req, res, next) {
  //   if (!req.user) return next(createError(401, 'Please login to view this page.'))
  //   next()
  // })
  if (!contact) {
    return next(createHttpError.NotFound('Please login to view this page.'));    // throw createHttpError(404, 'Contact no found!');

  };
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!!!`,
    data: contact,
  });
};


export async function createContactController(req, res) {
  const createdContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
} ;

export async function deleteContactController(req, res, next) {
  const {contactId} = req.params;

  const contact = deleteContact(contactId);

  if(!contact){
    return next(createHttpError(404,'Student not found'));
  }
  res.status(204).end();
}
 
export async function patchContactController(req, res, next) {
  const {contactId} = req.params;
  const {email} = req.body;

  const updatedContact = await patchContactEmail(contactId, email);
  if(updatedContact === null){
    return next(createHttpError.NotFound('Contact not found'));
  }
  res.status({status:200, message:'Contact email updated', data: updatedContact});
}