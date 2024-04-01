import { IsNotEmpty } from 'class-validator';

export class ItemDto {
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
