import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDto } from './dto/items.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsservice: ItemsService) {}

  @Post('/addItem')
  AddItem(@Body() itemdto: ItemDto) {
    return this.itemsservice.AddItem(itemdto);
  }

  @Get('/getAllItems/:userId')
  getAllItems(@Param('userId') userId:string) {
      console.log(userId)
   
    return this.itemsservice.getAllItems(userId);
  }

  @Patch('/updateItem/:id')
  updateItem(@Body() itemdto: ItemDto, @Param('id') id: string) {
    return this.itemsservice.updateItem(id, itemdto);
  }

  @Delete('/deleteItem/:id')
  deleteItem(@Param('id') id: string) {
    return this.itemsservice.deleteItem(id);
  }

  @Patch('/updateQuantity')
  updateQuantity(
    @Body('quantity') quantity: number,
    @Body('itemname') itemname: string,
  ) {
    return this.itemsservice.updateQuantity(quantity, itemname);
  }

  
}
