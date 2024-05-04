import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reviews } from './reviews.model';
import { ReviewsDTO } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('reviews') private readonly reviemodel: Model<Reviews>,
  ) {}

  async createReview(reviewdto: ReviewsDTO) {
    try {
      const { userid, message, star } = reviewdto;
      let newReview = await this.reviemodel.create({
        userid,
        message,
        star,
      });
      await newReview.save();
      return { message: 'new review added', newReview };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllReviews() {
    try {
      let reviews = await this.reviemodel.find().populate('userid');
      if (reviews.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'All Reviews', reviews };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
