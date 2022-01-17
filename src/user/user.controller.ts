import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { ResponseUserDto } from './dto/response.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UpdateTagsDto } from '../tag/dto/update.tags.dto';
import { ResponseCascadeTagsDto } from '../tag/dto/response.cascadeTags.dto';

@ApiTags('Пользователи')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получены теги пользователя.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка при получении.',
  })
  @ApiOperation({
    summary: 'Получение тегов пользователя.',
  })
  @Get('/')
  async getUser(@Request() req): Promise<ResponseUserDto> {
    const uid = req.user.uid;
    const user = await this.userService.getUser(uid);
    return { ...user };
  }
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Обновлен тег пользователя.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка при обновлении',
  })
  @ApiOperation({
    summary: 'Получение обновленного тега пользователя',
  })
  @Put('/')
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const uid = req.user.uid;
    return await this.userService.updateUser(updateUserDto, uid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно удален',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка при удалении пользователя',
  })
  @ApiOperation({
    summary: 'Удаление пользователя',
  })
  @Delete('/')
  async deleteUser(@Request() req): Promise<void> {
    return await this.userService.deleteUser(req);
  }

  @ApiBody({ type: UpdateTagsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Теги успешно обновлены.',
    type: ResponseCascadeTagsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Теги не обновлены.',
  })
  @ApiOperation({
    summary: 'Каскадное обвновление тегов',
  })
  @Post('/tag')
  async postCascadTag(
    @Request() req,
    @Body() dtoTags: UpdateTagsDto,
  ): Promise<ResponseCascadeTagsDto> {
    const uid = req.user.uid;
    return await this.userService.postCascadTag(uid, dtoTags);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тег успешно удален.',
    type: ResponseCascadeTagsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Теги не удален.',
  })
  @ApiOperation({
    summary: 'Удаление тега',
  })
  @Delete('/tag/:id')
  async deleteTagofUser(
    @Request() req,
    @Param('id') id: number,
  ): Promise<ResponseCascadeTagsDto> {
    const uid = req.user.uid;
    return await this.userService.deleteTagofUser(uid, id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получен тег пользователя.',
    type: ResponseCascadeTagsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Не получен тег пользователя.',
  })
  @ApiOperation({
    summary: 'Получение тега пользователя',
  })
  @Get('tag/my')
  async getMyTagOfUser(@Request() req): Promise<ResponseCascadeTagsDto> {
    const uid = req.user.uid;
    const tags = await this.userService.getUser(uid);
    return { tags: tags[0].tags };
  }
}
