import { IsString } from 'class-validator';

export class StringOptDTO {
  @IsString()
  value: string;

  @IsString()
  label: string;
}
