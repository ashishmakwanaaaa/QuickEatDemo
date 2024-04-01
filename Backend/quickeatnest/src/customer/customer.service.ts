import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Customer } from './customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('customers') private readonly customermodel: Model<Customer>,
  ) {}
  async AddCustomer(customerdto: CustomerDto) {
    try {
      const {
        firstname,
        lastname,
        emailid,
        phoneno,
        address,
        state,
        city,
        pincode,
      } = customerdto;
      let customer = await this.customermodel.findOne({ emailid });
      if (customer) {
        return { message: 'Customer Has ALready Exists' };
      }
      customer = await this.customermodel.create({
        firstname,
        lastname,
        emailid,
        phoneno,
        address,
        state,
        city,
        pincode,
      });
      await customer.save();
      return { message: 'Customer Added Successfully' };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCustomer() {
    try {
      let customers = await this.customermodel.find();
      if (customers.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'All Customer', customers };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateCustomer(id: string, customerdto: CustomerDto) {
    try {
      let customer = await this.customermodel.findById(id);
      if (!customer) {
        throw new NotFoundException();
      }
      customer = await this.customermodel.findByIdAndUpdate(id, customerdto, {
        new: true,
      });
      await customer.save();
      return { message: 'Customer Update Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteCustomer(id: string) {
    try {
      let customer = await this.customermodel.findById(id);
      console.log(customer);
      //   if (!customer) {
      //     throw new NotFoundException();
      //   }
      await customer.deleteOne();
      return { message: 'Customer Deleted', customer };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getCustomer(id: string) {
    try {
      let customer = await this.customermodel.findById(id);
      if (!customer) {
        throw new NotFoundException();
      }
      return { message: 'Single Customer', customer };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
