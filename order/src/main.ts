import { NestFactory } from '@nestjs/core';
import * as handleBars from 'express-handlebars';
import * as handleBarsHelpers from 'handlebars-helpers';
import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const { MICRO_MAPPING_URL, PORT } = process.env;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const { engine: hbsEngine } = handleBars.create({
    helpers: {
      ...handleBarsHelpers(),
      MICRO_MAPPING_URL: () => MICRO_MAPPING_URL,
    },
    extname: '.hbs',
    defaultLayout: 'layout',
    partialsDir: [path.join(__dirname, '..', 'views')],
  });

  app.engine('hbs', hbsEngine);
  app.setViewEngine('hbs');

  await app.listen(PORT || 3000);
}
bootstrap();
