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

export function createContact(payload){
  return ContactCollection.create(payload);
}

export function deleteContact(contactId){
 return ContactCollection.findByIdAndDelete(contactId);
}

export function patchContactEmail(contactId, email){
  return ContactCollection.findByIdAndUpdate(contactId, {onEmail: email}, {new:true});
}