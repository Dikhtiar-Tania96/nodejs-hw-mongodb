import createHttpError from 'http-errors';
import { 
  getAllContacts, 
  getContactById,
  createContact,
  deleteContact,
  updateContact
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';


//пошук усіх контактів
// export async function getContactsController(req, res) {
//   const contacts = await getAllContacts();
//   res.json({
//     status: 200,
//     data: contacts,
//     message: 'Successfully found contacts!',
//   });
// };


export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: contacts,
  });
};



//пошук контакту по id
export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(createHttpError.NotFound('Please login to view this page.'));    // throw createHttpError(404, 'Contact no found!');
  };
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!!!`,
    data: contact,
  });
};

//створення контакту
export async function createContactController(req, res) {
  const createdContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
} ;

//видалення контакту
export async function deleteContactController(req, res, next) {
  const {contactId} = req.params;
  const contact = deleteContact(contactId);
  if(!contact){
    return next(createHttpError(404,'Student not found'));
  }
  res.status(204).end();
};
 
//оновлення контакту
// export async function patchContactController(req, res, next) {
//   const {contactId} = req.params;
//   const {email} = req.body;
//   const updatedContact = await updateContact(contactId, email);
//   if(updatedContact === null){
//     return next(createHttpError.NotFound('Contact not found'));
//   }
//   res.status({status:200, message:'Contact email updated', data: updatedContact});
// }
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    next(createHttpError(404, 'Contacts not found'));
    return;
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};