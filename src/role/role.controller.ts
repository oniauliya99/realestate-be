import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetAllDto } from 'src/utils/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() dto: GetAllDto) {
    return this.roleService.findAll(dto);
  }

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.roleService.findOne(publicId);
  }

  @Patch(':publicId')
  update(
    @Param('publicId') publicId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(publicId, updateRoleDto);
  }

  @Delete(':publicId')
  remove(@Param('publicId') publicId: string) {
    return this.roleService.remove(publicId);
  }
}
