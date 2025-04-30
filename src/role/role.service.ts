import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from 'src/utils/dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    const existngRole = await this.prismaService.userRole.findUnique({
      where: { name },
    });
    if (existngRole) {
      throw new ConflictException('Role already exists');
    }
    const role = await this.prismaService.userRole.create({
      data: {
        name,
      },
    });
    return { message: 'Successfully created role', data: role.publicId };
  }

  async findAll(dto: GetAllDto) {
    const { page, take, orderBy, order, search, filters } = dto;
    const filtersObj = { deletedAt: null };
    const { result, ...paging } = await this.prismaService.findAndCountAll({
      table: this.prismaService.userRole,
      select: {
        publicId: true,
        name: true,
        createdAt: true,
      },
      where: {
        filtersObj,
        filters,
        search,
      },
      take: take >= 20 ? 100 : take,
      skip: { page, take: take >= 20 ? 100 : take },
      orderBy: {
        [orderBy]: order,
      },
    });
    return {
      data: { ...paging, result },
    };
  }

  async findOne(publicId: string) {
    const role = await this.prismaService.userRole.findUnique({
      select: { publicId: true, name: true, createdAt: true, deletedAt: true },
      where: { publicId },
    });
    if (!role) {
      throw new ConflictException('Role not found');
    }
    if (role.deletedAt) {
      throw new NotFoundException('Role not found');
    }
    return {
      data: role,
    };
    // return `This action returns a #${id} role`;
  }

  async update(publicId: string, updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.prismaService.userRole.findUnique({
      where: { publicId },
    });
    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }
    const { name } = updateRoleDto;
    if (name) {
      const existingRole = await this.prismaService.userRole.findUnique({
        where: { name },
      });
      if (existingRole) {
        throw new ConflictException('Role already exists');
      }
    }
    const role = await this.prismaService.userRole.update({
      where: { publicId },
      data: {
        name,
      },
    });
    return {
      message: 'Successfully updated role',
      data: role.publicId,
    };
  }

  async remove(publicId: string) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { userRoleId: publicId },
    });
    if (existingUser) {
      throw new ConflictException(
        'Role cannot be deleted because it is assigned to a user',
      );
    }
    await this.prismaService.userRole.delete({
      where: { publicId },
    });
    return {
      message: 'Successfully deleted role',
    };
  }
}
