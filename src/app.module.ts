import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    RoleModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
