import { IsNumber, IsString } from 'class-validator';

export class NumberOptDTO {
  @IsNumber()
  value: number;

  @IsString()
  label: string;
}
