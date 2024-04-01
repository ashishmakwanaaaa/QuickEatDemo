import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Payment extends Document {
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

  @Prop({type:String})
  amount: string;

  @Prop({type:String})
  paymentMethod: string;

  @Prop({ default: Date.now })
  Date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
