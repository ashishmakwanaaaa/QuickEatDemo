import {
  ConflictException,
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
      userId,
      itemname,
      itemdescription,
      price,
      upToOffer,
      quantity,
      image,
      itemcategory,
    } = itemdto;
    try {
      let item = await this.itemsmodel.findOne({ itemname,userId });
      if (item) {
        throw new ConflictException({ message: 'Item Has Already Exists' });
      }
      item = await this.itemsmodel.create({
        userId,
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

  async getAllItems(userId: string) {
    try {
      let items = await this.itemsmodel.find({ userId });
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

  async updateQuantity(quantities: [number], itemnames: [string]) {
    try {
      console.log(quantities, itemnames);
      for (let i = 0; i < itemnames.length; i++) {
        const item = itemnames[i];
        const qty = quantities[i];
        let items = await this.itemsmodel.findOne({ itemname: item });
        items.quantity = qty;
        await items.save();
        console.log(items);
        if (!items) {
          throw new NotFoundException(`Item not found with name: ${item}`);
        }

        console.log(`Item quantity updated successfully for: ${item}`);
      }
      return { messsage: 'Item Quantity Update Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async getallitems(){
    try {
      const items = await this.itemsmodel.find();
      if(items.length === 0){throw new NotFoundException()}
      return {message:"All Items",items}
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
