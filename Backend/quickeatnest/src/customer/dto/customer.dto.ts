import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  isNumber,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CustomerDto {
  @IsNotEmpty()
  userId: ObjectId;

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
