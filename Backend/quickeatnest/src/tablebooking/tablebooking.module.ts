import { Module } from '@nestjs/common';
import { TablebookingController } from './tablebooking.controller';
import { TablebookingService } from './tablebooking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TableBookingSchema } from './tablebook.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'tablebooking', schema: TableBookingSchema },
    ]),
  ],
  controllers: [TablebookingController],
  providers: [TablebookingService],
})
export class TablebookingModule {}
