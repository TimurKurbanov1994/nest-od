import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  public readonly email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsOptional()
  public readonly password?: string;

  @IsString()
  @IsOptional()
  @Length(4, 100)
  public readonly nickname?: string;
}
