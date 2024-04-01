import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Customer {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  emailid: string;

  @Prop()
  phoneno: number;

  @Prop()
  address: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  pincode: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
