import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { LocationService } from 'src/location/location.service';

@Module({
  controllers: [BranchController],
  providers: [BranchService, LocationService],
})
export class BranchModule {}
