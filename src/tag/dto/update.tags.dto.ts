import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagsDto {
  @ApiProperty()
  @IsArray()
  public readonly tags: number[];
}
