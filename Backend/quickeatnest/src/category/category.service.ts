import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.model';
import { CategoryDto } from './dto/category.dto';
import { Item } from 'src/items/items.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') private readonly categorymodel: Model<Category>,
    @InjectModel('items') private readonly itemmodel: Model<Item>,
  ) {}

  async AddCategory(categorydto: CategoryDto) {
    try {
      const { categoryname, image, userId } = categorydto;
      console.log(categoryname, image, userId);
      let catogory = await this.categorymodel.findOne({
        categoryname,
        image,
        userId,
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
        userId,
      });
      newcategory.save();
      return { message: 'category Added Succesfully', newcategory };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCatories(userid: string) {
    try {
      let categories = await this.categorymodel.find({
        userId: userid,
        isdeleted: false,
      });
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
      const items = await this.itemmodel.deleteMany({
        itemcategory: category.categoryname,
      });
      if (!category) {
        throw new NotFoundException();
      }
      const newcategory = await this.categorymodel.findByIdAndUpdate(
        id,
        {
          isdeleted: true,
        },
        { new: true },
      );
      await newcategory.save();
      return { message: 'Deleted Successfully', category };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async UpdateCategory(id: string, categorydto: CategoryDto) {
    try {
      const category = await this.categorymodel.findById(id);
      if (!category) {
        throw new NotFoundException();
      }
      let updatedcategory = await this.categorymodel.findByIdAndUpdate(
        id,
        categorydto,
        { new: true },
      );
      await updatedcategory.save();
      return { message: 'Category Update Successfully', updatedcategory };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
