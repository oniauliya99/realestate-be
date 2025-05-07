import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { GetAllDto } from 'src/utils/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  getAll(@Query() dto: GetAllDto) {
    return this.branchService.findAll(dto);
  }

  @Post()
  async create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Put(':publicId ')
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchService.update(publicId, dto);
  }
}
