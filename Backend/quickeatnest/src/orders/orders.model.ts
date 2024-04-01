import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {
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
