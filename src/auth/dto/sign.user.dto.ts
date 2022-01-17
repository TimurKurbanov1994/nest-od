import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignUpDto {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ minimum: 8, maximum: 100 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password contains only three characters categories: digits, lowercase and uppercase characters.',
  })
  public readonly password: string;

  @ApiProperty({ minimum: 4, maximum: 100 })
  @IsString()
  @Length(4, 100)
  public readonly nickname: string;
}
