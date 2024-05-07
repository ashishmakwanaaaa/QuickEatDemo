import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.model';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [
    AuthModule,
    ItemsModule,
    MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
