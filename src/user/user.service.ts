import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthSignUpDto } from '../auth/dto/sign.user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { ResponseUserDto } from './dto/response.user.dto';
import { ResponseCascadeTagsDto } from '../tag/dto/response.cascadeTags.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private tagService: TagService,
  ) {}

  async createUser(dto: AuthSignUpDto) {
    const { email, nickname, password } = dto;
    const newUser = this.usersRepository.create({
      email,
      nickname,
      password,
    });
    return await this.usersRepository.save(newUser);
  }

  async getUser(uid: string): Promise<any> {
    return this.usersRepository.find({
      where: { uid },
      relations: ['tags'],
      select: ['nickname', 'email'],
    });
  }

  async updateUser(dto: UpdateUserDto, uid: string): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOne(uid);
    await this.usersRepository.update(uid, dto);
    const saveUser = await this.usersRepository.save({ ...user, ...dto });
    return new ResponseUserDto(saveUser);
  }

  async deleteUser(req) {
    const uid = req.user.uid;
    req.headers.authorization = '';
    const result = await this.usersRepository.delete({ uid });
    if (result.affected === 0) {
      throw new NotFoundException(`Пользователь с uid: ${uid} не найден`);
    }
  }

  async deleteTagofUser(uid, id): Promise<ResponseCascadeTagsDto> {
    await this.tagService.deleteTag(+id, uid);
    return await this.getUser(uid);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: [{ email }],
    });
  }

  public async postCascadTag(uid, dtoTags): Promise<ResponseCascadeTagsDto> {
    const tagIds = await this.tagService.getIdTag();
    const isMatch = dtoTags.tags.every((x) => tagIds.includes(x));
    if (!isMatch) {
      throw new HttpException('Не существует тегов', HttpStatus.BAD_REQUEST);
    }
    const result = await this.tagService.updateCreatorOfTag(dtoTags.tags, {
      uid,
    });
    return { tags: result.raw };
  }
}
