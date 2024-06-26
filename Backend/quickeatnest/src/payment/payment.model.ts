import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/auth.model';
import { Customer } from 'src/customer/customer.model';

@Schema()
export class Payment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'customer' })
  customerID: Customer;
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  cardHoldername: string;

  @Prop({ type: Object })
  billingaddress: {
    city: string;
    state: string;
    pincode: string;
  };

  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  paymentMethod: string;

  @Prop({ default: Date.now })
  Date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
