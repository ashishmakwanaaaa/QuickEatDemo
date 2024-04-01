import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment } from './payment.model';
import { PaymentDto } from './dto/payment.dto';
import { OrderDto } from 'src/orders/dto/order.dto';
console.log(process.env.user);
const stripe = require('stripe')(process.env.stripesecretkey);

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('payments') private readonly paymentmodel: Model<Payment>,
  ) {}

  async createPayment(paymentdto: PaymentDto) {
    try {
      const { email, cardHoldername, billingaddress, amount, paymentMethod } =
        paymentdto;
      let payment = await this.paymentmodel.create({
        email,
        cardHoldername,
        billingaddress,
        amount,
        paymentMethod,
      });
      await payment.save();
      return { message: 'Payment Successfully', payment };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(0);
    }
  }

  async cardPayment(orderdto: OrderDto) {
    try {
      const lineItems = orderdto.selectedItem.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.itemname,
            images: [item.image],
          },
          unit_amount: (item.price - (item.price * item.upToOffer) / 100) * 100,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:3000/paymentsuccess/${orderdto.customerID}/${orderdto.totalAmount}`,
        cancel_url: `http://localhost:3001/`,
        customer_email: orderdto.customeremailid,
      });

      console.log('created session');
      return { url: session.url };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getALLPayment() {
    try {
      let payments = await this.paymentmodel.find();
      let cardPayment = await this.paymentmodel.find({
        paymentMethod: 'card',
      });
      let cashPayment = await this.paymentmodel.find({
        paymentMethod: 'cash',
      });
      if (
        payments.length === 0 ||
        cardPayment.length === 0 ||
        cashPayment.length === 0
      ) {
        throw new NotFoundException();
      }
      return {
        message: 'Payments ALL Find',
        payments,
        cardPayment,
        cashPayment,
      };
    } catch (error) {
      throw new InternalServerErrorException(0);
    }
  }
}
