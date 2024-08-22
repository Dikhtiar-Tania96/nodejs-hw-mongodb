import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactCollection.find();//повертає масив усіх контактів
    console.log('Contacts:', contacts); 
    return contacts;
  } catch (error){
    console.error('Error fetching contacts:', error);
    throw error;
  };
};

export const getContactById = async(contactId) => {//повертає контакт за id
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