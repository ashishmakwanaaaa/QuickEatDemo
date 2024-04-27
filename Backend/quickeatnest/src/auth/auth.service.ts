import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './auth.model';
import { File } from 'multer';
import { ChangePassworDto, UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import  * as Pusher from "pusher";

@Injectable()
export class AuthService {
  pusher:Pusher
  constructor(
    @InjectModel('users') private readonly usermodel: Model<User>,
    private jwtService: JwtService,
  ) {

    this.pusher= new Pusher({
      appId: "1794656",
      key: "6a591575265653bc0738",
      secret: "f4a05c7ff3ba02d45de2",
      cluster: "ap2",
      useTLS: true
    });
  }

  transported = nodemailer.createTransport({
    service: process.env.service,
    auth: {
      user: process.env.userforemail,
      pass: process.env.passforemail,
    },
  });

  async signup(signupdto: UserSignUpDto) {
    console.log(signupdto);
    try {
      const {
        restaurantname,
        ownername,
        emailid,
        password,

        lat,
        long,
        confirmpassword,
      } = signupdto;
      let user = await this.usermodel.findOne({ emailid });
      if (user) {
        return { message: 'User Has Already Exists' };
      }
      const hashedpassword = await bcrypt.hash(password, 10);
      user = await this.usermodel.create({
        restaurantname,
        ownername,
        emailid,
        password: hashedpassword,

        lat,
        long,
        confirmpassword: confirmpassword,
      });
      await user.save();
      return { user, message: 'User Signup Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async login(logindto: UserLoginDto, res: Response) {
    const { emailid, password } = logindto;
    let user = await this.usermodel.findOne({ emailid });
    if (!user) {
      throw new NotFoundException('Wrong Email!....Please enter correct email');
    }
    user.isActive = true;
    await user.save();
    const decode = await bcrypt.compare(password, user.password);
    console.log(decode, password, user.password);
    if (!decode) {
      throw new UnauthorizedException('Wrong Password');
    }
    const token = await this.jwtService.sign({
      id: user._id,
      isadmin: user.isAdmin,
    });
    return { message: 'Login Successfully', user, token };
  }

  async forgotpsw(email: string) {
    try {
      let user = await this.usermodel.findOne({ emailid: email });

      if (!user) {
        throw new NotFoundException();
      }
      const token = await this.jwtService.sign({ id: user._id });
      if (token) {
        const mailOptions = {
          from: 'quickeatwithus123@gmail.com',
          to: email,
          subject: 'Reset Your Password',
          text: `This Link Is Valid For 2 minutes http://localhost:3000/forgotpassword/${user._id}/${token}`,
        };
        this.transported.sendMail(mailOptions, (err, info) => {
          if (!err) {
            return { message: 'Email Send Successfully' };
          } else {
            throw new NotFoundException();
          }
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async validuser(id: string, token: string) {
    try {
      let validuser = this.usermodel.findById(id);
      let validyoken = this.jwtService.verify(token);
      if (validuser && validyoken) {
        return { message: 'This User Has Valid' };
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async resetpsw(id: string, password: string) {
    try {
      console.log(id, password);
      const user = await this.usermodel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      return { message: 'Password changed successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async changepsw(id: string, chnagepswdto: ChangePassworDto) {
    try {
      const { oldpassword, newpassword, newchangepassword } = chnagepswdto;
      const user = await this.usermodel.findById(id);
      if (!user) {
        throw new NotFoundException();
      }
      const decode = await bcrypt.compare(oldpassword, user.password);
      if (!decode) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Wrong Password',
        };
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;
      await user.save();
      return { message: 'Successfully Password Change', user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getUser(name: string) {
    try {
      let user = await this.usermodel.findOne({ restaurantname: name });
      if (!user) {
        throw new NotFoundException();
      }
      return { message: 'Find One user', user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateProfile(usersignupdto: UserSignUpDto, id: string) {
    // console.log('User SignUP DTO', usersignupdto);
    const { image, resimage } = usersignupdto;
    try {
      let user = await this.usermodel.findById(id);
      if (!user) {
        throw new NotFoundException();
      }

      let updateuser = await this.usermodel.findByIdAndUpdate(
        id,
        {
          ...usersignupdto,
          image,
          resimage,
        },
        { new: true },
      );
      await updateuser.save();
      console.log(updateuser);
      return { message: 'Profile Updated Successfully', updateuser };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async getAllUser() {
    try {
      const users = await this.usermodel.find({ isAdmin: false });
      if (users.length === 0) {
        throw new NotFoundException();
      }
      console.log('User List: ', users);
      const activeusers = await this.usermodel.find({
        isActive: true,
        isAdmin: false,
      });
      console.log(activeusers);
      // if (activeusers.length === 0) {
      //   throw new NotFoundException();
      // }
      return { message: 'All User', users, activeusers };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async logout(id: string) {
    try {
      const user = await this.usermodel.findById(id);
      if (!user) {
        throw new InternalServerErrorException();
      }
      user.isActive = false;
      await user.save();
      return { message: 'User Logout Successfully', user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // Assuming JWT for token verification
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }

  async trigger(channel:string,event:string,data:any) {
    console.log(channel,event,data)
    await this.pusher.trigger(channel,event,data)
    return []
  }
}
