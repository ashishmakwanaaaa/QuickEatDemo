import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: User;

  @Prop()
  customerID: string;

  @Prop()
  customerfirstname: string;

  @Prop()
  customerlastname: string;

  @Prop()
  customerphoneno: number;

  @Prop()
  customeremailid: string;

  @Prop()
  selectedItem: [SelectedItemSchema];

  @Prop()
  totalAmount: number;

  @Prop({ default: Date.now })
  Date: Date;
}

export class SelectedItemSchema {
  @Prop()
  itemname: string;

  @Prop()
  itemprice: number;

  @Prop()
  itemqty: number;

  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
