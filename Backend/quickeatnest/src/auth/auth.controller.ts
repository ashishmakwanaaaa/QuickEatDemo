import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassworDto, UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

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
  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage,
    }),
  )
  uploadFile(@UploadedFiles() files: Multer.File[]) {
    console.log(files);
    const filenames = files.map((file) => file.filename);
    return { message: 'File uploaded successfully!', filenames };
  }

  @Patch('/updateProfile/:id')
  updateProfile(@Body() usersignupdto, @Param('id') id: string) {
    return this.userservice.updateProfile(usersignupdto, id);
  }
  catch(error) {}

  @Get('/getalluser')
  getAllUser(){
    return this.userservice.getAllUser();
  }

  @Get('/logout/:id')
  logout(@Param('id') id:string){
    return this.userservice.logout(id);
  }
}
