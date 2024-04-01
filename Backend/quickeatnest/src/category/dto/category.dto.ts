import { IsNotEmpty } from 'class-validator';

export class CategoryDto {

  
  @IsNotEmpty()
  categoryname: string;
  
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  userId:string;
}
