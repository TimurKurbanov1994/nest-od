import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TagEntity } from './tag.entity';
import { ResponseTagDto } from './dto/response.tag.dto';
import { ResponseTagsDto } from './dto/response.tags.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagsRepository: Repository<TagEntity>,
  ) {}

  async createTag(dto: any): Promise<ResponseTagDto> {
    const { name, sortOrder, creator } = dto;
    const newUser = this.tagsRepository.create({
      name,
      creator,
      sortOrder,
    });

    return await this.tagsRepository.save(newUser);
  }

  async getTag(id: number): Promise<ResponseTagDto> {
    const tag = await this.tagsRepository
      .createQueryBuilder('tag')
      .select(['tag.name', 'tag.sortOrder'])
      .where('tag.id = :id', { id })
      .leftJoin('tag.creator', 'creator')
      .addSelect(['creator.uid', 'creator.nickname'])
      .getOne();
    if (!tag) {
      throw new NotFoundException(`тег с id: ${id} не найден`);
    }
    return tag;
  }

  async getTagsSort(query): Promise<ResponseTagsDto> {
    const { offset, length } = query;
    const quantity = await this.tagsRepository.count();
    const sortTags = this.tagsRepository
      .createQueryBuilder('tag')
      .select(['tag.name', 'tag.sortOrder'])
      .leftJoin('tag.creator', 'creator')
      .addSelect(['creator.uid', 'creator.nickname'])
      .offset(offset)
      .limit(length);
    function hasOrder(arg) {
      if (query.hasOwnProperty(arg)) {
        sortTags.addOrderBy('tag.sortOrder', 'DESC');
      }
    }
    hasOrder(query);

    if (query.hasOwnProperty('sortByOrder')) {
      sortTags.addOrderBy('tag.sortOrder', 'DESC');
    }
    if (query.hasOwnProperty('sortByName')) {
      sortTags.addOrderBy('name', 'DESC');
    }
    const result = await sortTags.getMany();

    return {
      data: result,
      meta: {
        offset: +offset,
        length: +length,
        quantity,
      },
    };
  }

  async updateTag(idTag: number, dto: any, uidUser: string): Promise<any> {
    const isMatchTag = await this.isOwnerOfTag(idTag, uidUser);
    const tag = await this.tagsRepository.findOne(idTag);
    if (isMatchTag) {
      await this.tagsRepository.update(idTag, dto);
      await this.tagsRepository.save({ ...tag, ...dto });
      return await this.getTag(idTag);
    }
    return {};
  }

  async deleteTag(idTag: number, uidUser: string): Promise<void> {
    const isMatchTag = await this.isOwnerOfTag(idTag, uidUser);
    console.log(isMatchTag);
    if (isMatchTag) {
      const result = await this.tagsRepository.delete({ id: idTag });
      if (result.affected === 0) {
        throw new NotFoundException(`тег с id: ${idTag} не найден`);
      }
    } else {
      throw new NotFoundException(`тег с id: ${idTag} невозможно удалить`);
    }
  }

  public async isOwnerOfTag(idTag, uidUser) {
    const isMatch = await this.tagsRepository.find({
      where: {
        id: idTag,
        creator: {
          uid: uidUser,
        },
      },
      relations: ['creator'],
    });
    return !!isMatch.length;
  }

  public async getIdTag(): Promise<any> {
    const tagIds = await this.tagsRepository.find({
      select: ['id'],
    });
    return tagIds.map((item) => item.id);
  }

  async updateCreatorOfTag(ids: number[], uid) {
    const payload = { creator: uid };
    return await this.tagsRepository
      .createQueryBuilder('tag')
      .useTransaction(true)
      .update<TagEntity>(TagEntity, { ...payload })
      .where('tag.id IN (:...ids)', { ids })
      .returning(['id', 'name', 'sortOrder'])
      .execute();
  }

  async getTags(ids) {
    return await this.tagsRepository.find({ where: [ids] });
  }
}
