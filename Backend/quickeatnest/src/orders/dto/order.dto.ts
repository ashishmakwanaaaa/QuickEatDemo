import { IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  customerID: string;

  @IsNotEmpty()
  customerfirstname: string;

  @IsNotEmpty()
  customerlastname: string;

  @IsNotEmpty()
  customerphoneno: number;

  @IsNotEmpty()
  customeremailid: string;

  @IsNotEmpty()
  selectedItem: SelectedDto[];

  @IsNotEmpty()
  totalAmount: number;
}

export class SelectedDto {
  @IsNotEmpty()
  itemname: string;

  @IsNotEmpty()
  itemprice: number;

  @IsNotEmpty()
  itemqty: number;

  @IsNotEmpty()
  totalPrice: number;
  image: any;
  price: number;
  upToOffer: number;
  quantity: any;
}
