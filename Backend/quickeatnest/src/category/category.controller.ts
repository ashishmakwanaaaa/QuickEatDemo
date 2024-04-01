import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryservice: CategoryService) {}

  @Post('/addcategory')
  AddCategory(@Body() categorydto: CategoryDto) {
    return this.categoryservice.AddCategory(categorydto);
  }

  @Get('/getAllCategories')
  getAllCatories() {
    return this.categoryservice.getAllCatories();
  }

  @Delete('/delete/:id')
  DeleteCategory(@Param('id') id: string) {
    return this.categoryservice.DeleteCategory(id);
  }
}
