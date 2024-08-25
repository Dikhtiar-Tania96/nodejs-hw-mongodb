// import { SORT_ORDER } from '../constants/index.js';
import { ContactCollection } from '../db/models/contact.js';
import {calculatePaginationData} from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({page, perPage}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find();
  const contactsCount = await ContactCollection.find()
.merge(contactsQuery)
.countDocuments();

const contacts = await contactsQuery.skip(skip).limit(limit).exec();
const paginationData = calculatePaginationData(contactsCount, perPage, page);

return{
  data: contacts,
  ...paginationData
};
};


// export const getAllContacts = async ({
//   page = 1,
//   perPage = 10,
//   sortOrder = SORT_ORDER.ASC,
// }) => {
//   try {
//     const limit = perPage;
//     const skip = (page - 1) * perPage;
//     const contactsQuery = ContactCollection.find();
//   } catch (error) {
//     console.error('Error fetching contacts:', error);
//     throw error;
//   }
// };

// export const getAllContacts = async ({page,perPage}) => {
//   try {
//     const limit = perPage;
//     const skip = (page - 1) * perPage;
//     const contactsQuery = ContactCollection.find();

//     const contacts = ContactCollection.find().skip(skip).limit(perPage);
//     const count = await ContactCollection.countDocuments();
//     console.log({contacts, count});

//     return [];
//     // const contacts = await ContactCollection.find();//повертає масив усіх контактів

//     // console.log('Contacts:', contacts);
//     // return contacts;
//   } catch (error){
//     console.error('Error fetching contacts:', error);
//     throw error;
//   };
// };



export const getContactById = async (contactId) => {
  //повертає контакт за id
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

//створення нового контакту
export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

//зміна даних у контакті
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

//видалення контакту
export const deleteContact = async (contactId) => {
  const contact = await ContactCollection.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};
