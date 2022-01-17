import { TagEntity } from '../tag.entity';

export class ResponseTagDto {
  public readonly id: number;
  public readonly name: string;
  public readonly sortOrder: number;

  public constructor(tag: TagEntity) {
    this.id = tag.id;
    this.name = tag.name;
    this.sortOrder = tag.sortOrder;
  }
}
