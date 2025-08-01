// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bufferLogs:true,
  });

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
    
  });

  await app.listen(3001);
}
bootstrap();
