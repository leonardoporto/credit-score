import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@nicholas.braun/nestjs-redoc';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalGuards(new RolesGuard(new Reflector()));

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Credit Score resources')
    .setDescription('Credit Score API description')
    .setVersion('1.0')
    .addTag('core')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const redocOptions: RedocOptions = {
    title: 'Credit Score Server',
    logo: {
      url: 'https://thumbs.dreamstime.com/b/credit-score-gauge-rating-meter-vector-icon-flat-style-isolated-white-background-107738613.jpg',
      backgroundColor: '#F0F0F0',
      altText: 'Credit Score logo',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    tagGroups: [
      {
        name: 'Core resource',
        tags: ['core'],
      },
      {
        name: 'user Resources',
        tags: ['user'],
      },
    ],
  };
  await RedocModule.setup('/docs', app, document, redocOptions);

  await app.listen(3000);
}
bootstrap();
