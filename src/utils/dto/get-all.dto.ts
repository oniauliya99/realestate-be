import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Validate } from 'class-validator';
import { FiltersValidator } from '../validator/filters.validator';

export class GetAllDto {
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number = 0;

  @IsOptional()
  // @IsInt()
  @ApiProperty({ required: false })
  take?: number = 20;

  @IsOptional()
  @ApiProperty({ required: false })
  orderBy?: string = 'id';

  @IsOptional()
  @ApiProperty({ required: false })
  order?: string = 'asc';

  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @Validate(FiltersValidator)
  filters?: string;
}
