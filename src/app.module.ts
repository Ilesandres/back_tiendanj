import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOTS, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './config/constant';
import { AuthModule } from './modules/auth/auth.module';
import { PeopleModule } from './modules/people/people.module';
import { UserModule } from './modules/user/user.module';
import { RolModule } from './modules/rol/rol.module';
import { MailsModule } from './core/mails/mails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        type:'mysql',
        host:configService.get(DB_HOTS),
        port:configService.get(DB_PORT),
        username:configService.get(DB_USER),
        password:configService.get(DB_PASSWORD),
        database:configService.get(DB_NAME),
        entities:[__dirname +'/**/*.entity{.ts,.js}'],
        synchronize:true,
        logging:true,
      }),
      inject:[ConfigService],
    }),
    AuthModule,
    PeopleModule,
    UserModule,
    RolModule,
    MailsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
