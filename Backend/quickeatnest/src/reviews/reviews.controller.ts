import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsDTO } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewservice: ReviewsService) {}

  @Post('/createReview')
  createReview(@Body() reviewdto:ReviewsDTO){
    return this.reviewservice.createReview(reviewdto)
  }

  @Get('/getallreviews')
  getAllReviews(){
    return this.reviewservice.getAllReviews();
  }
}
