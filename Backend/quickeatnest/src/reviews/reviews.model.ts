import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class Reviews {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userid: User;

  @Prop()
  star: string;

  @Prop()
  message: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Reviews);
