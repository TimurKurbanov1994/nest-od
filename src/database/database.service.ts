import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  query(query: string, values = []) {
    return this.pool.query(query, values).then((result: QueryResult) => {
      return result.rows;
    });
  }
}
