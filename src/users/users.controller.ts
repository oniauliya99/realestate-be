import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('verify-email')
  verifyEmail(@Body('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }
}
