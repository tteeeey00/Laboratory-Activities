import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS para makakonekta si React frontend (localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  // ✅ Start server on port 3000 or from .env PORT
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
