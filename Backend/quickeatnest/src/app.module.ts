import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.username}:${process.env.password}@${process.env.cluster}.69lknpi.mongodb.net/${process.env.database}?retryWrites=true&w=majority`,
    ),
    MulterModule.register({
      dest: './imageupload',
    }),
    CustomerModule,
    ItemsModule,
    OrdersModule,
    PaymentModule,
    CategoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your uploads folder
      serveRoot: '/uploads', // URL path at which to serve the static assets
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
console.log(process.env)
