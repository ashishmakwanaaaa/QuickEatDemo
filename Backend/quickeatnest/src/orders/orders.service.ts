import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.model';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders') private readonly ordermode: Model<Order>,
  ) {}

  async createOrder(orderdto: OrderDto) {
    // console.log(orderdto);
    try {
      const {
        userId,
        customerID,
        customerfirstname,
        customerlastname,
        customeremailid,
        customerphoneno,
        selectedItem,
        totalAmount,
      } = orderdto;
      let order = await this.ordermode.create({
        userId,
        customerID,
        customerfirstname,
        customerlastname,
        customeremailid,
        customerphoneno,
        selectedItem,
        totalAmount,
      });
      await order.save();
      return { message: 'Order Created', order };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(0);
    }
  }

  async getTop5Items(userid: string) {
    try {
      console.log(userid);
      let top5items = await this.ordermode.aggregate([
        {
          $match: { $expr: { $eq: ['$userId', { $toObjectId: userid }] } },
        },
        {
          $unwind: '$selectedItem',
        },
        {
          $group: {
            _id: '$selectedItem.itemcategory',
            count: { $sum: '$selectedItem.qty' },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);
      console.log('Top 5 Items: ', top5items);
      return { message: 'top 5 selling items', top5items };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getSpecificOrder(date: string, email: string) {
    try {
      const searchDate = new Date(date);

      const searchDateStart = new Date(searchDate);
      searchDateStart.setUTCHours(0, 0, 0, 0);

      const searchDateEnd = new Date(searchDate);
      searchDateEnd.setUTCHours(23, 59, 59, 999);

      console.log(searchDateStart, searchDateEnd);

      const orders = await this.ordermode.find({
        customeremailid: email,
        Date: {
          $gte: searchDateStart,
          $lte: searchDateEnd,
        },
      });

      if (!orders || orders.length === 0) {
        throw new NotFoundException('Orders not found');
      }

      console.log(orders);
      return { message: 'Specific Orders', orders };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllOrders(userid: string) {
    try {
      let orders = await this.ordermode.find({ userId: userid });
      if (orders.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'All Orders', orders };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getSingleOrder(id: string) {
    try {
      console.log(id);
      let order = await this.ordermode.findById(id);
      if (!order) {
        throw new NotFoundException();
      }
      return { message: 'Single Order Find', order };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getCustomerOrder(id: string) {
    try {
      let order = await this.ordermode.find({ customerID: id });
      if (!order) {
        throw new NotFoundException(0);
      }
      return { message: 'Orders Find', order };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllOrder(){
    try {
      const orders = await this.ordermode.find();
      if(orders.length === 0){throw new NotFoundException()}
      return {message:"All Orders",orders}
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
