import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export type Location = {
  village: {
    label: string;
    value: string;
  };
};

export class CreateBranchDto {
  @IsNotEmpty({ message: 'Code harus diisi' })
  @IsString({ message: 'Code harus berupa string' })
  @Length(2, 3, { message: 'Code harus 2-3 karakter' })
  @ApiProperty()
  code: string;

  @IsNotEmpty({ message: 'Name harus diisi' })
  @IsString({ message: 'Name harus berupa string' })
  @Length(5, 100, { message: 'Name harus 5-100 karakter' })
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: true,
    example: {
      village: {
        label: 'Desa Sukamaju',
        value: 11999,
      },
    },
  })
  @IsNotEmpty({
    message: 'Location harus berisi Village ID',
  })
  @IsString({ message: 'Location harus berupa string' })
  @ApiProperty()
  location: Location;
}
