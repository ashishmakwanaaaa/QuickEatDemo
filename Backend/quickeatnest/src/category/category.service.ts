import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.model';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') private readonly categorymodel: Model<Category>,
  ) {}

  async AddCategory(categorydto: CategoryDto) {
    try {
      const { categoryname, image } = categorydto;
      console.log(categoryname, image);
      let catogory = await this.categorymodel.findOne({
        categoryname,
        image,
      });
      if (catogory) {
        return {
          message: 'Category Already Exists',
          catogory,
        };
      }
      let newcategory = await this.categorymodel.create({
        categoryname,
        image,
      });
      newcategory.save();
      return { message: 'category Added Succesfully', newcategory };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCatories() {
    try {
      let categories = await this.categorymodel.find();
      if (categories.length === 0) {
        return { message: 'Empty Data' };
      }
      return { message: 'All Categories', categories };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async DeleteCategory(id: string) {
    try {
      const category = await this.categorymodel.findById(id);
      if (!category) {
        throw new NotFoundException();
      }
      await category.deleteOne();

      return { message: 'Deleted Successfully', category };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
