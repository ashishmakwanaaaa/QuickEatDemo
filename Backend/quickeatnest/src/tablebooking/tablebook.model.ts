import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class TableBooking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: User;

  @Prop()
  TableId: string;

  @Prop()
  Customername: string;

  @Prop()
  Customerphoneno: string;

  @Prop()
  Howmanypeople: number;

  @Prop()
  Time: string;

  @Prop()
  Date: Date;

  @Prop({ default: Date.now })
  createAt: Date;
}

export const TableBookingSchema = SchemaFactory.createForClass(TableBooking);
