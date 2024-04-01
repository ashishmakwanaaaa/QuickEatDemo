import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersrices: OrdersService) {}

  @Post('/createOrder')
  createOrder(@Body() orderdto: OrderDto) {
    return this.ordersrices.createOrder(orderdto);
  }

  @Get('/top5sellingitems/:userid')
  getTop5Items(@Param('userid') userid:string) {
    return this.ordersrices.getTop5Items(userid);
  }

  @Get('/getAllOrders/:userid')
  getAllOrders(@Param("userid") userid:string) {
    return this.ordersrices.getAllOrders(userid);
  }

  @Get('/getOneOrder/:id')
  getSingleOrder(@Param('id') id: string) {
    return this.ordersrices.getSingleOrder(id);
  }

  @Get('/getOrder/:date/:email')
  getSpecificOrder(@Param('date') date: string, @Param('email') email: string) {
    return this.ordersrices.getSpecificOrder(date, email);
  }

  @Get('/customerorder/:id')
  getCustomerOrder(@Param('id') id: string) {
    return this.ordersrices.getCustomerOrder(id);
  }
}
