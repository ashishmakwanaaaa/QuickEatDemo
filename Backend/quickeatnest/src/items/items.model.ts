import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/auth.model';

@Schema()
export class Item {

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:"users"})
  userId:User

  @Prop()
  itemname: string;

  @Prop()
  itemcategory: string;

  @Prop()
  itemdescription: string;

  @Prop()
  price: number;

  @Prop()
  upToOffer: number;

  @Prop()
  quantity: number;

  @Prop()
  image: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
