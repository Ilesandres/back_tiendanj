import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRED, JWT_SECRET } from 'src/config/constant';
import { UserModule } from '../user/user.module';
import { MailsModule } from 'src/core/mails/mails.module';

@Module({
  imports:[
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get(JWT_SECRET),
        signOptions:{
          expiresIn:configService.get(JWT_EXPIRED)
        }
      })
    }),
    UserModule,
    MailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
