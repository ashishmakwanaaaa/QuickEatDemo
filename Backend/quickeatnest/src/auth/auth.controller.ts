import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassworDto, UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private userservice: AuthService) {}

  @Post('/signup')
  signup(@Body() usersignupdto: UserSignUpDto) {
    return this.userservice.signup(usersignupdto);
  }

  @Post('/login')
  async login(@Body() userlogindto: UserLoginDto, @Res() res: Response) {
    const token = await this.userservice.login(userlogindto, res);

    res
      .cookie('token', token.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({
        status: 'ok',
        message: token.message,
        user: token.user,
        token: token.token,
      });
  }

  @Post('/forgotPassword')
  forgotpsw(@Body('email') email: string) {
    return this.userservice.forgotpsw(email);
  }

  @Get('/forgotPassword/:id/:token')
  validuser(@Param('id') id: string, @Param('token') token: string) {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid user ID');
    }
    return this.userservice.validuser(id, token);
  }

  @Post('/forgotPassword/:id/:token')
  resetpsw(
    @Body('password') password: string,
    @Param('id') id: string,
    // @Param('token') token: string,
  ) {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid user ID');
    }
    return this.userservice.resetpsw(id, password);
  }

  @Post('/updatepassword/:ownername')
  changepsw(
    @Param('ownername') ownername: string,
    @Body() chnagepswdto: ChangePassworDto,
  ) {
    return this.userservice.changepsw(ownername, chnagepswdto);
  }

  @Get('/getUser/:name')
  getUser(@Param('name') name: string) {
    return this.userservice.getUser(name);
  }

  @Patch('/updateProfile/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateProfile(
    @UploadedFile() file,
    @Body() usersignupdto,
    @Body() base64Dto,
    @Param('id') id: string,
  ) {
    console.log(file);

    try {
      const { base64 } = base64Dto;
      const imagePath = `uploads/${id}-profile.jpg`; 
      return this.userservice.updateProfile(usersignupdto, id,imagePath);
    } catch (error) {}

  }
}
