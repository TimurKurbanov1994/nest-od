import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/sign.user.dto';
import { ResponseTokenDto } from './dto/response.token.dto';
import { LoginUserDto } from './dto/login.user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTagDto } from '../tag/dto/create.tag.dto';
import { ApiImplicitBody } from '@nestjs/swagger/dist/decorators/api-implicit-body.decorator';

@ApiTags('Аутентификация')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Аутентификация пользователя. Получен JWT токен.',
    type: ResponseTokenDto,
  })
  @ApiOperation({
    summary: 'Аутентификация пользователя',
  })
  @Post('/login')
  login(@Body() userDto: LoginUserDto): Promise<ResponseTokenDto> {
    return this.authService.login(userDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    description: 'Успешно зарегестрирован! Получен JWT токен.',
    status: HttpStatus.OK,
    type: ResponseTokenDto,
  })
  @ApiResponse({
    description: 'Неверный запрос.',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiBody({ type: AuthSignUpDto })
  registration(@Body() userDto: AuthSignUpDto): Promise<ResponseTokenDto> {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Разлогивания пользователя' })
  @ApiResponse({
    description: 'Успешно вышли из системы.',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Неверный запрос.',
    status: HttpStatus.BAD_REQUEST,
  })
  @Post('/logout')
  logout(@Request() req): Promise<void> {
    return this.authService.logout(req);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({
    description: 'Успешно обновили токен.',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Неверный запрос.',
    status: HttpStatus.BAD_REQUEST,
  })
  @Get('/token')
  refreshToken(@Request() req): Promise<ResponseTokenDto> {
    return this.authService.refreshToken(req);
  }
}
