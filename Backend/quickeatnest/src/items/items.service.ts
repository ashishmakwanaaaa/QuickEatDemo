import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './items.model';
import { ItemDto } from './dto/items.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('items') private readonly itemsmodel: Model<Item>) {}

  async AddItem(itemdto: ItemDto) {
    const {
      itemname,
      itemdescription,
      price,
      upToOffer,
      quantity,
      image,
      itemcategory,
    } = itemdto;
    try {
      let item = await this.itemsmodel.findOne({ itemname });
      if (item) {
        return { message: 'Item Has Already Exists' };
      }
      item = await this.itemsmodel.create({
        itemdescription,
        itemname,
        price,
        upToOffer,
        quantity,
        image,
        itemcategory,
      });
      await item.save();
      return { message: 'Item Added', item };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAllItems() {
    try {
      let items = await this.itemsmodel.find();
      if (items.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'All Items', items };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateItem(id: string, itemdto: ItemDto) {
    try {
      let item = await this.itemsmodel.findById(id);
      if (!item) {
        throw new NotFoundException();
      }
      item = await this.itemsmodel.findByIdAndUpdate(id, itemdto, {
        new: true,
      });
      await item.save();
      return { message: 'Item Update Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteItem(id: string) {
    try {
      let item = await this.itemsmodel.findById(id);
      if (!item) {
        throw new NotFoundException();
      }
      await item.deleteOne();
      return { message: 'Item deleted', item };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateQuantity(quantity: number, itemname: string) {
    try {
      let item = await this.itemsmodel.findOne({ itemname });
      if (!item) {
        throw new NotFoundException();
      }
      item.quantity = quantity;
      await item.save();
      return { messsage: 'Item Quantity Update Successfully', item };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
