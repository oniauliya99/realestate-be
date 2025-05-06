import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-guard/jwt-auth.guard';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('province')
  getProvinces() {
    return this.locationService.getProvince();
  }

  @Get('city/:provinceId')
  getCities(@Param('provinceId') provinceId: string) {
    return this.locationService.getCity(provinceId);
  }

  @Get('district/:cityId')
  getDistricts(@Param('cityId') cityId: string) {
    return this.locationService.getDistricts(cityId);
  }

  @Get('village/:districtId')
  getVillages(@Param('districtId') districtId: string) {
    return this.locationService.getVillages(districtId);
  }
}
