import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'SUPERADMIN' })
  @IsNotEmpty()
  @IsEnum(Role)
  name: Role;
}
