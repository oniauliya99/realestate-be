import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { GetAllDto } from 'src/utils/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from 'src/location/location.service';

@Injectable()
export class BranchService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly locationService: LocationService,
  ) {}
  create(createBranchDto: CreateBranchDto) {
    return 'This action adds a new branch';
  }

  async findAll(dto: GetAllDto) {
    const searchStringField = ['code', 'name'];
    const { page, take, orderBy, order, search, filters } = dto;
    const { result, ...data } = await this.prismaService.findAndCountAll({
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
            const loc = await this.locationService.getOneByVillageId(
              branch.villageId,
            );
            branch.location = loc;
            delete result.villageId;
            return branch;
          }),
        ),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
