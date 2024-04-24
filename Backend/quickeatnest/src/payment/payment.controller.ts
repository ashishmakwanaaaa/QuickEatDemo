import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { OrderDto } from 'src/orders/dto/order.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentservice: PaymentService) {}

  @Post('/createPayment')
  createPayment(@Body() paymentdto: PaymentDto) {
    return this.paymentservice.createPayment(paymentdto);
  }

  @Post('/create-checkout-session')
  cardPayment(@Body() orderdto: OrderDto) {
    return this.paymentservice.cardPayment(orderdto);
  }

  @Get('/allpayment/:userid')
  getALLPayment(@Param('userid') userid:string) {
    return this.paymentservice.getALLPayment(userid);
  }

  @Get('/getAllSales')
  getAllSales(){
    return this.paymentservice.getAllSales();
  }
}
