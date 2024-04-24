import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class Customer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: User;

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
