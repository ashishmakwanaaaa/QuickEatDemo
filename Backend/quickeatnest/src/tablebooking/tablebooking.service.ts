import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TableBooking } from './tablebook.model';
import { TableBookingDTO } from './dto/tablebook.dto';

@Injectable()
export class TablebookingService {
  constructor(
    @InjectModel('tablebooking')
    private readonly tablebookingmodel: Model<TableBooking>,
  ) {}

  async createTableBook(tablebookdto: TableBookingDTO) {
    console.log(tablebookdto)
    try {
      const {
        userId,
        TableId,
        Customername,
        Customerphoneno,
        Time,
        Date,
        Howmanypeople,
      } = tablebookdto;
      let tablebook = await this.tablebookingmodel.create({
        userId,
        TableId,
        Customername,
        Customerphoneno,
        Time,
        Date,
        Howmanypeople,
      });

      await tablebook.save();
      return { message: 'Book Table Successfully', tablebook };
    } catch (error) {
      console.log(error);
    }
  }
}
