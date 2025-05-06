import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, example: 'beyondrealityid@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'Lv1ors123@' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
