import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, username, password } = dto;
    const existing = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { username: username ?? undefined }],
      },
    });

    if (existing) {
      throw new ConflictException('Email or username already in use');
    }
    const role = await this.prismaService.userRole.findFirst({
      where: {
        name: 'USER',
      },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        userRoleId: role.publicId,
        emailVerificationToken: verificationToken,
      },
    });
    await this.mailService.sendVerificationEmail(
      user.email,
      verificationToken,
      username,
    );

    return {
      message: 'User registered successfully',
      data: {
        id: user.publicId,
        email: user.email,
        username: user.username,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prismaService.user.findFirst({
      where: { emailVerificationToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }
}
