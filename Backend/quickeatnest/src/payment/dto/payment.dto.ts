import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
export class BillingDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  pincode: string;
}

export class PaymentDto {
  @IsNotEmpty()
  userId:string
  @IsNotEmpty()
  customerID:string
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  cardHoldername: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BillingDto)
  billingaddress: BillingDto;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  paymentMethod: string;
}

