import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  isNumber,
} from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  emailid: string;

  @IsNotEmpty()
  phoneno: number;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  pincode: string;
}
