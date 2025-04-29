import { ValidateIf } from 'class-validator';

export const IsNullable = (datatype?: string) =>
  ValidateIf((object, value) => {
    if (!value || value === null) return false;
    if (typeof value === 'string' && value === '') return false;

    return true;
  });
