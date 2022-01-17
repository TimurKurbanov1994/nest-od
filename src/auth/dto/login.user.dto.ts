import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ maximum: 100, minimum: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  public readonly password: string;
}
