import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './infrastructure/socket/socket.adapter';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FE_URL, process.env.FE_PROD_URL],
    credentials: true, 
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app, app.get(JwtService)))
  app.setGlobalPrefix('api');
  await app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();
