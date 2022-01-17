import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  public readonly sortOrder: number;
}
