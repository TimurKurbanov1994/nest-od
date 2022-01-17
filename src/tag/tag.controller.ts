import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Put,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { TagService } from './tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { CreateTagDto } from './dto/create.tag.dto';
import { ResponseTagDto } from './dto/response.tag.dto';
import { ResponseTagsDto } from './dto/response.tags.dto';
import { UpdateTagDto } from './dto/update.tag.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Теги')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тег успешно создан.',
    type: ResponseTagDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Тег не создан.',
  })
  @ApiOperation({
    summary: 'Создания тега',
  })
  @Post('/')
  async createTag(
    @Body() dto: CreateTagDto,
    @Request() req,
  ): Promise<ResponseTagDto> {
    const uid = req.user.uid;
    const post = { ...dto, creator: uid };
    const saveTag = await this.tagService.createTag(post);
    return new ResponseTagDto(saveTag);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получение отсортированных тегов.',
    type: ResponseTagsDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'тег не найден.' })
  @ApiOperation({
    summary: 'Получение тегов',
  })
  @Get('/')
  async getTagsSort(@Request() req): Promise<ResponseTagsDto> {
    return await this.tagService.getTagsSort(req.query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получение тега.',
    type: ResponseTagDto,
  })
  @ApiOperation({
    summary: 'Получение тега',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'тег не найден.' })
  @Get('/:id')
  async getTag(@Param('id') id: number): Promise<ResponseTagDto> {
    return await this.tagService.getTag(id);
  }

  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тег упешно обновлен.',
    type: ResponseTagDto,
  })
  @ApiOperation({
    summary: 'Обновление тега',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'тег не найден.' })
  @Put('/:id')
  async updateTag(
    @Param('id') id: number,
    @Body() updateTag: UpdateTagDto,
    @Request() req,
  ): Promise<ResponseTagDto> {
    const uid = req.user.uid;
    return await this.tagService.updateTag(id, updateTag, uid);
  }

  @ApiOperation({
    summary: 'Удаление тега',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Успешно удален' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'тег не найден.' })
  @Delete('/:id')
  async deleteUser(@Param('id') id: number, @Request() req): Promise<void> {
    const uid = req.user.uid;
    return await this.tagService.deleteTag(id, uid);
  }
}
