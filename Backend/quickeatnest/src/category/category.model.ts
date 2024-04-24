import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class Category {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: User;


  @Prop()
  categoryname: string;

  @Prop()
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
