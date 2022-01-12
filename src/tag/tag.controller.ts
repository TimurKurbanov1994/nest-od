import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('/')
  async sign(@Body() dto: any) {
    return await this.tagService.createTag(dto);
  }

  @Get('/')
  async getTagsSort(@Request() req) {
    return await this.tagService.getTagsSort(req.query);
  }

  @Get('/:id')
  async getTag(@Param('id') id: number) {
    return await this.tagService.getTag(id);
  }

  @Put('/:id')
  async updateTag(@Param('id') id: number, @Body() updateTag: any) {
    return await this.tagService.updateTag(id, updateTag);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    return await this.tagService.deleteTag(id);
  }
}
