import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './items.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'items', schema: ItemSchema }]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [MongooseModule.forFeature([{ name: 'items', schema: ItemSchema }])],
})
export class ItemsModule {}
