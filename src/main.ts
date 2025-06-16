import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constant';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{cors:true});
  const configService= app.get(ConfigService);
  const port = configService.get(SERVER_PORT);
  console.log(`server running in  http://localhost:${port}`)
  await app.listen(port ?? 3000);
}
bootstrap();
