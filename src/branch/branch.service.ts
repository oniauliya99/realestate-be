import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { GetAllDto } from 'src/utils/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createBranchDto: CreateBranchDto) {
    const { code, location: loc, name } = createBranchDto;
    const branchExists = await this.prismaService.branch.findFirst({
      where: {
        code,
      },
    });

    if (branchExists) return new ConflictException('Branch already exists');
    const location = await this.prismaService.village.findUnique({
      select: {
        id: true,
        name: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
      },
      where: {
        id: loc.village.value,
      },
    });
    const branch = await this.prismaService.branch.create({
      data: {
        code,
        name,
        location,
      },
    });
    return {
      message: 'Branch created successfully',
      data: { id: branch.publicId },
    };
  }

  async findAll(dto: GetAllDto) {
    const searchStringField = ['code', 'name'];
    const { page, take, orderBy, order, search, filters } = dto;
    const { result, ...data } = await this.prismaService.findAndCountAll({
      select: { publicId: true, code: true, name: true },
      table: this.prismaService.branch,
      where: { filters, search, searchStringField },
      take,
      skip: { page, take },
      orderBy: {
        [orderBy]: order,
      },
    });

    return {
      data: {
        ...data,
        result: await Promise.all(
          result.map(async (branch) => {
            return branch;
          }),
        ),
      },
    };
  }

  async findOne(publicId: string) {
    const branch = await this.prismaService.branch.findUnique({
      where: { publicId },
    });
    if (!branch) return new NotFoundException('Branch not found');
    return {
      data: branch,
    };
  }

  async update(publicId: string, updateBranchDto: UpdateBranchDto) {
    const { code, location: loc, name } = updateBranchDto;
    const branchExists = await this.prismaService.branch.findFirst({
      where: {
        code,
      },
    });
    if (!branchExists) return new NotFoundException('Branch Not Found');
    const location = await this.prismaService.village.findUnique({
      select: {
        id: true,
        name: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
      },
      where: {
        id: loc.village.value,
      },
    });
    const branch = await this.prismaService.branch.update({
      data: {
        code,
        name,
        location,
      },
      where: { publicId },
    });
    return {
      message: 'Branch created successfully',
      data: { id: branch.publicId },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
