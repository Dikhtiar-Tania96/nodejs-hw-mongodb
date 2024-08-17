import dotenv from 'dotenv';
// import process from 'process';

dotenv.config();

export const env = (name, defaultValue) => {
  const value = process.env[name];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`${name} variable doesn't exist`);
};