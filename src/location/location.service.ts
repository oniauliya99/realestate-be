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
}
