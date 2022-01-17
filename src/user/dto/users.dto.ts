import { IsEmail, IsString, Length } from 'class-validator';

export class UsersDto {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @Length(4, 100)
  public readonly nickname: string;
}
