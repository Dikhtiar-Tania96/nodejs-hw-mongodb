const ParseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
};

const ParseIsFavorite = (isFavourite) => {
  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  }
  if (typeof isFavorite === 'string') {
    // Перетворюємо рядок 'true' або 'false' на відповідне булеве значення
    return isFavourite.toLowerCase() === 'true';
  }
  return undefined; // Повертаємо undefined, якщо значення не підходить
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parseContactType = ParseContactType(contactType);
  const parseIsFavorite = ParseIsFavorite(isFavourite);

  return {
    contactType: parseContactType,
    isFavourite: parseIsFavorite,
  };
};
