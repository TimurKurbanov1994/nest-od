import { ResponseTagDto } from '../../tag/dto/response.tag.dto';
import { UserEntity } from '../user.entity';

export class ResponseUserDto {
  public email: string;
  public nickname: string;
  public tags: ResponseTagDto;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.nickname = user.nickname;
  }
}
