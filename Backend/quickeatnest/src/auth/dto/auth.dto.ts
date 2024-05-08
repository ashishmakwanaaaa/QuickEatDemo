import { IsEmail, IsNotEmpty, Min } from 'class-validator';
import { Multer } from 'multer';

export class UserSignUpDto {
  @IsNotEmpty()
  restaurantname: string;

  @IsNotEmpty()
  ownername: string;

  @IsNotEmpty()
  @IsEmail()
  emailid: string;

  @IsNotEmpty()
  @Min(6)
  password: string;

  @IsNotEmpty()
  confirmpassword: string;

  // @IsNotEmpty()
  image: Multer.File;

  resimage: Multer.File;

  isAdmin: boolean;

  isActive: boolean;

  lat: string;

  long: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  emailid: string;

  @IsNotEmpty()
  password: string;
}

export class ChangePassworDto {
  @IsNotEmpty()
  oldpassword: string;
  @IsNotEmpty()
  newpassword: string;
  @IsNotEmpty()
  newchangepassword: string;
}
