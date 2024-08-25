const ParseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
};

const ParseIsFavorite = (isFavorite) => {
  if (typeof isFavorite === 'boolean') {
    return isFavorite;
  }
  if(typeof isFavorite === 'string'){
    // Перетворюємо рядок 'true' або 'false' на відповідне булеве значення
    return isFavorite.toLowerCase() === 'true';
  }
    return undefined;  // Повертаємо undefined, якщо значення не підходить
  };


export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parseContactType = ParseContactType(contactType);
  const parseIsFavorite = ParseIsFavorite(isFavorite);

  return {
    contactType: parseContactType,
    isFavorite: parseIsFavorite,
  };
};
