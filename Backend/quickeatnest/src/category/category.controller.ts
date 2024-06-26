import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('category')
export class CategoryController {
  constructor(private categoryservice: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post('/addcategory')
  AddCategory(@Body() categorydto: CategoryDto) {
    return this.categoryservice.AddCategory(categorydto);
  }

  @Get('/getAllCategories/:userid')
  getAllCatories(@Param('userid') userid: string) {
    return this.categoryservice.getAllCatories(userid);
  }

  @Delete('/delete/:id')
  DeleteCategory(@Param('id') id: string) {
    return this.categoryservice.DeleteCategory(id);
  }

  @Patch('/editcategory/:id')
  UpdateCategory(@Param('id') id: string, @Body() categorydto: CategoryDto) {
    return this.categoryservice.UpdateCategory(id, categorydto);
  }
}
