import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for all origins (safe for local development)
  app.enableCors({
    origin: '*', // allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000);
  console.log('✅ Backend running at http://localhost:3000');
}
bootstrap();
