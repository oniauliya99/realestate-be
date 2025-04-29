import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'filtersValidator', async: false })
export class FiltersValidator implements ValidatorConstraintInterface {
  validate(filterText: string, _args?: ValidationArguments) {
    const filters = filterText.split(',');
    if (filters.length === 0) return false;

    const hasColon = filters.find((a) => a.includes(':'), null);
    if (!hasColon) return false;

    return true;
  }

  defaultMessage(_args?: ValidationArguments): string {
    return 'Format filter tidak sesuai, ex: field1:value1,field2.sub1.sub2:value2';
  }
}
