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
import { SeedersModule } from './config/seeders/seeders.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { VariationproductModule } from './modules/variationproduct/variationproduct.module';
import { TypemeasuremedidaModule } from './modules/typemeasuremedida/typemeasuremedida.module';
import { SpiceModule } from './modules/spice/spice.module';
import { ColorModule } from './modules/color/color.module';
import { TypeorderModule } from './modules/typeorder/typeorder.module';
import { PaymenthmethodModule } from './modules/paymenthmethod/paymenthmethod.module';
import { PaymentstatusModule } from './modules/paymentstatus/paymentstatus.module';
import { VouchersabonosModule } from './modules/vouchersabonos/vouchersabonos.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { StatusshipmentModule } from './modules/statusshipment/statusshipment.module';

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
    MailsModule,
    SeedersModule,
    ProductModule,
    CategoryModule,
    VariationproductModule,
    TypemeasuremedidaModule,
    SpiceModule,
    ColorModule,
    TypeorderModule,
    PaymenthmethodModule,
    PaymentstatusModule,
    VouchersabonosModule,
    PaymentModule,
    OrderModule,
    ShipmentModule,
    StatusshipmentModule
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
