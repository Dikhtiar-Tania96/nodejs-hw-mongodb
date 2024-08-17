import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactCollection.find();//повертає масив усіх контактів
    console.log('Contacts:', contacts); 
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  };
};


export const getContactById = async (contactId) => {//повертає контакт за id
  const contact = await ContactCollection.findById(contactId);
  return contact;
};