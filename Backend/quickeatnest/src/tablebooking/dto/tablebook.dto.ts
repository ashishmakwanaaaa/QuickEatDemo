import { IsNotEmpty } from 'class-validator';

export class TableBookingDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  TableId: string;

  @IsNotEmpty()
  Customername: string;

  @IsNotEmpty()
  Customerphoneno: string;

  @IsNotEmpty()
  Howmanypeople: number;

  @IsNotEmpty()
  Time: string;

  @IsNotEmpty()
  Date: Date;
}
