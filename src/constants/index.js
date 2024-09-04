import path from 'node:path';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
  };

  export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;//15hvs
  export const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000;


  export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
  