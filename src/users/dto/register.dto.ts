import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true, example: 'bintangdimas@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'password1234' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ required: true, example: 'Bintang Dimas' })
  @IsNotEmpty()
  @IsString()
  username?: string;
}
