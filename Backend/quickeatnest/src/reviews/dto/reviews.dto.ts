import { IsNotEmpty } from 'class-validator';

export class ReviewsDTO {
  @IsNotEmpty()
  userid: string;

  @IsNotEmpty()
  star: string;

  @IsNotEmpty()
  message: string;
}
