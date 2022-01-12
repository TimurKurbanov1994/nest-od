import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: any) {
    return this.authService.login(userDto);
  }

  @Post('/signin')
  registration(@Body() userDto: any) {
    return this.authService.registration(userDto);
  }

  @Post('/logout')
  logout(@Body() userDto: any) {
    return this.authService.logout(userDto);
  }
}
