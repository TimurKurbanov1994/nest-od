import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: any) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: any) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser(userDto);
    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = {
      email: user.email,
      uid: user.uid,
      nickname: user.nickname,
    };
    return {
      token: this.jwtService.sign(payload),
      expire: process.env.EXPIRE_IN,
    };
  }

  private async validateUser(userDto: any) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл или пароль',
    });
  }

  async logout(userDto: any) {
    const user = await this.validateUser(userDto);
    return this.jwtService.decode();
  }
}
