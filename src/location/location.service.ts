import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProvince() {
    const result = await this.prismaService.province.findMany({
      orderBy: { id: 'asc' },
    });

    return {
      data: result.reduce((a, b) => [...a, { value: b.id, label: b.name }], []),
    };
  }

  async getCity(provinceId: string) {
    const result = await this.prismaService.city.findMany({
      where: { provinceId },
      orderBy: { id: 'asc' },
    });
    return {
      data: result.reduce((a, b) => [...a, { value: b.id, label: b.name }], []),
    };
  }

  async getDistricts(cityId: string) {
    const result = await this.prismaService.district.findMany({
      where: { cityId },
      orderBy: { id: 'asc' },
    });
    return {
      data: result.reduce((a, b) => [...a, { value: b.id, label: b.name }], []),
    };
  }

  async getVillages(districtId: string) {
    const result = await this.prismaService.village.findMany({
      where: { districtId },
      orderBy: { id: 'asc' },
    });
    return {
      data: result.reduce((a, b) => [...a, { value: b.id, label: b.name }], []),
    };
  }

  async getOneByVillageId(villageId: string) {
    const village = await this.prismaService.village.findFirst({
      where: { id: villageId },
      include: {
        province: true,
        city: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
      },
    });

    // if (!village) {
    //   throw new Error('Village not found');
    // }

    // const { province, city, district, id, name } = village;

    return {
      province: {
        value: village?.province.id ?? null,
        label: village?.province.name ?? null,
      },
      city: {
        value: village?.city?.id ?? null,
        label: village?.city?.name ?? null,
      },
      district: {
        value: village?.district?.id ?? null,
        label: village?.district?.name ?? null,
      },
      village: {
        value: village?.id ?? null,
        label: village?.name ?? null,
      },
    };
  }

  async findOneCityByName(cityName: string) {
    return this.prismaService.city.findFirst({
      where: { name: { contains: cityName } },
    });
  }

  async findOneCityDetailByName(cityName: string) {
    return this.prismaService.city.findFirst({
      where: { name: { contains: cityName } },
      include: { province: true },
    });
  }
}
