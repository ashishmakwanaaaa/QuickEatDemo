import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassworDto, UserLoginDto, UserSignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private userservice: AuthService) {}

  @Post('/signup')
  signup(@Body() usersignupdto: UserSignUpDto) {
    return this.userservice.signup(usersignupdto);
  }

  @Post('/login')
  login(@Body() userlogindto: UserLoginDto) {
    return this.userservice.login(userlogindto);
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
  updateProfile(@Body() usersignupdto: UserSignUpDto, @Param('id') id: string) {
    return this.userservice.updateProfile(usersignupdto,id);
  }
}
