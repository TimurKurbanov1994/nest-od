import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthSignUpDto } from './dto/sign.user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  // constructor(private readonly databaseService: DatabaseService) {}
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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

  async updateUser(dto: any, uid: string): Promise<any> {
    const user = await this.usersRepository.findOne(uid);
    await this.usersRepository.update(uid, dto);
    return await this.usersRepository.save({ ...user, ...dto });
  }

  async deleteUser(uid: string) {
    return await this.usersRepository.delete({ uid });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: [{ email }],
    });
  }

  // return await this.databaseService.query(
  //   'INSERT INTO users (uid, email, password,  nickname) VALUES ($1, $2, $3, $4) RETURNING *',
  //   [uid, email, hasPass, nickname],
  // );

  // async getUser(uid: string): Promise<any> {
  //   return await this.databaseService.query(
  //     `SELECT * FROM users WHERE uid = '${uid}'`,
  //   );
  // }
  //
  // async updateUser(dto: any, uid: string): Promise<any> {
  //   const { email, password, nickname } = dto;
  //   const hasPass = await bcrypt.hash(password, 10);
  //
  //   return await this.databaseService.query(
  //     `UPDATE users SET (email, password,  nickname) WHERE users.uid = '${uid}' VALUES ($1, $2, $3) RETURNING *`,
  //     [email, hasPass, nickname],
  //   );
  // }
  //
  // async deleteUser(uid: string) {
  //   return await this.databaseService
  //     .query(`DELETE FROM users WHERE uid = '${uid}'`)
  //     .then(() => {
  //       data: 'User deleted';
  //     });
  // }
}
