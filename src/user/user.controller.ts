import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthSignUpDto } from './dto/sign.user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signin')
  async sign(@Body() dto: AuthSignUpDto) {
    return await this.userService.createUser(dto);
  }

  @Get()
  async getUser(@Query('id') id: string) {
    console.log(id);
    return await this.userService.getUser(id);
  }

  @Put()
  async updateUser(@Query('uid') uid: string, @Body() updateUserDto: any) {
    console.log(updateUserDto, uid);
    return await this.userService.updateUser(updateUserDto, uid);
  }
  //
  @Delete()
  async deleteUser(@Query('uid') uid: string) {
    return await this.userService.deleteUser(uid);
  }
}
