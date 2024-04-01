import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Item {
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
