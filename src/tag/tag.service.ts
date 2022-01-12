import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  // constructor(private readonly databaseService: DatabaseService) {}
  constructor(
    @InjectRepository(TagEntity)
    private tagsRepository: Repository<TagEntity>,
  ) {}

  async createTag(dto: any) {
    const { name, sortOrder, creator } = dto;
    const newUser = this.tagsRepository.create({
      name,
      creator,
      sortOrder,
    });

    return await this.tagsRepository.save(newUser);
  }

  async getTag(id: number): Promise<any> {
    return await this.tagsRepository.find({
      where: { id },
      relations: ['creator'],
      select: ['name', 'sortOrder'],
    });
  }

  async getTagsSort(query): Promise<any> {
    const { offset, length } = query;
    const paramSortByOrder = query.hasOwnProperty('sortByOrder')
      ? 'DESC'
      : null;
    const paramSortByName = query.hasOwnProperty('sortByName') ? 'DESC' : null;
    return await this.tagsRepository.find({
      order: {
        sortOrder: paramSortByOrder,
        name: paramSortByName,
      },
      skip: offset,
      take: length,
    });
  }

  async updateTag(id: number, dto: any): Promise<any> {
    const tag = await this.tagsRepository.findOne(id);
    await this.tagsRepository.update(id, dto);
    return await this.tagsRepository.save({ ...tag, ...dto });
  }

  async deleteTag(id: number) {
    return await this.tagsRepository.delete({ id });
  }

  // async createTag(dto: any) {
  //   const { name, sortOrder = 0, creator } = dto;
  //   // const creator = 'b0413c39-0230-434d-8206-7c05e0aedc87';
  //   return await this.databaseService.query(
  //     'INSERT INTO tag (name, sortOrder, creator) VALUES ($1, $2, $3) RETURNING *',
  //     [name, sortOrder, creator],
  //   );
  // }
  //
  // async getTag(id: string): Promise<any> {
  //   console.log(id);
  //   return await this.databaseService.query(
  //     `SELECT email, nickname FROM tag LEFT JOIN users ON tag.creator = users.uid WHERE id = '${id}'`,
  //   );
  // }
  //
  // async updateTag(dto: any, uid: string): Promise<any> {
  //   const { email, password, nickname } = dto;
  //
  //   return await this.databaseService.query(
  //     `UPDATE Tags SET (email, password,  nickname) WHERE Tags.uid = '${uid}' VALUES ($1, $2, $3) RETURNING *`,
  //     [email, nickname],
  //   );
  // }
  //
  // async deleteTag(uid: string) {
  //   return await this.databaseService
  //     .query(`DELETE FROM Tags WHERE uid = '${uid}'`)
  //     .then(() => {
  //       data: 'Tag deleted';
  //     });
  // }
}
