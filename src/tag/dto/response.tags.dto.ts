import { ResponseTagDto } from './response.tag.dto';

export class ResponseTagsDto {
  public readonly data: ResponseTagDto[];
  public readonly meta: responseMeta;
}

class responseMeta {
  public readonly offset: number;
  public readonly length: number;
  public readonly quantity: number;
}
