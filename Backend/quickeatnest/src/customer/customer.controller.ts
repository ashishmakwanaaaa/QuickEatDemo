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
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('customer')
export class CustomerController {
  constructor(private customerservice: CustomerService) {}

  @UseGuards(AuthGuard)
  @Post('/addCustomer')
  AddCustomer(@Body() customerdto: CustomerDto) {
    return this.customerservice.AddCustomer(customerdto);
  }

  @Get('/getAllCustomer/:userid')
  GetAllCustomer(@Param('userid') userid: string) {                                                                     
    return this.customerservice.getAllCustomer(userid);
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
