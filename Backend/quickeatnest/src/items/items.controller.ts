import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDto } from './dto/items.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Multer } from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private itemsservice: ItemsService) {}

  @Post('/addItem')
  AddItem(@Body() itemdto: ItemDto) {
    return this.itemsservice.AddItem(itemdto);
  }

  @Get('/getAllItems/:userId')
  getAllItems(
    @Param('userId') userId: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.itemsservice.getAllItems(userId, search, sort, category);
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
    @Body('quantity') quantity: [number],
    @Body('itemname') itemname: [string],
  ) {
    return this.itemsservice.updateQuantity(quantity, itemname);
  }

  @Get('/getitems')
  getallitems() {
    return this.itemsservice.getallitems();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async UploadFile(@UploadedFile() file: Multer.File) {
    console.log(file);
    const a = await this.itemsservice.UploadImage(file.buffer);
    console.log(a);
    return this.itemsservice.UploadImage(file.buffer);
  }
}
