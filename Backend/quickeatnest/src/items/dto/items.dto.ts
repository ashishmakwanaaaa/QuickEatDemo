import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ItemDto {


  @IsNotEmpty()
  userId:ObjectId;

  @IsNotEmpty()
  itemname: string;

  @IsNotEmpty()
  itemcategory: string;

  @IsNotEmpty()
  itemdescription: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  upToOffer: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  image: string;
}
