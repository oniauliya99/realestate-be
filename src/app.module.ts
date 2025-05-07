import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { LocationModule } from './location/location.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true, // agar semua module bisa akses env
    }),
    // JwtModule.register({
    //   secret: process.env.SECRET_KEY,
    //   signOptions: { expiresIn: '1d' },
    // }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RoleModule,
    EmailModule,
    LocationModule,
    BranchModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
