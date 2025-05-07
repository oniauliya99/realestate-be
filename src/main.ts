import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { SwaggerTheme } from 'swagger-themes';
import { SwaggerThemeNameEnum } from 'swagger-themes/build/enums/swagger-theme-name';
import { PrismaExceptionFilter } from './utils/prisma-exception.filter';
import { ResponseInterceptor } from './utils/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3001 },
  });
  app.setGlobalPrefix('api/v1/realestate');
  app.enableShutdownHooks();
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerTheme = new SwaggerTheme();
  const config = new DocumentBuilder()
    .setTitle('Realestate Service')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/realestate/spec', app, document, {
    customCss: swaggerTheme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
  });

  process.on('beforeExit', async () => app.close());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT, process.env.SERVER);
  const appURL = await app.getUrl();
  Logger.log(`ON ${appURL}`, 'Realestate Service');
  // Logger.log(`ON ${appURL}/api/payment/spec`, 'Payment Service');
}
bootstrap();
