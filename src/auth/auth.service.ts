import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from '../user/user.service';
import { AuthSignUpDto } from './dto/sign.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { ResponseTokenDto } from './dto/response.token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginUserDto): Promise<ResponseTokenDto> {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: AuthSignUpDto): Promise<ResponseTokenDto> {
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

  private async generateToken(user: any): Promise<ResponseTokenDto> {
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

  private async validateUser(userDto: LoginUserDto): Promise<LoginUserDto> {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
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

  async logout(req) {
    req.headers.authorization = '';
  }

  async refreshToken(req) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException({
        message: 'Нет токена',
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);
    return this.generateToken(user);
  }
}
