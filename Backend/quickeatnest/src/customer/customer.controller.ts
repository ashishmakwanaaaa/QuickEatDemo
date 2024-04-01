import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerservice: CustomerService) {}

  @Post('/addCustomer')
  AddCustomer(@Body() customerdto: CustomerDto) {
    return this.customerservice.AddCustomer(customerdto);
  }

  @Get('/getAllCustomer')
  GetAllCustomer() {
    return this.customerservice.getAllCustomer();
  }

  @Patch('/editCustomer/:id')
  updateCustomer(@Body() customerdto: CustomerDto, @Param('id') id: string) {
    return this.customerservice.updateCustomer(id, customerdto);
  }

  @Delete('/deleteCustomer/:id')
  deleteCustomer(@Param('id') id: string) {
    return this.customerservice.deleteCustomer(id);
  }

  @Get('/getCustomer/:id')
  getCustomer(@Param('id') id: string) {
    return this.customerservice.getCustomer(id);
  }
}
