import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/user.entity';
import { TagEntity } from './tag/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'test_oq',
      migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
      entities: [UserEntity, TagEntity],
      cli: {
        migrationsDir: '/src/migrations',
      },
      synchronize: true,
    }),
    UserModule,
    TagModule,
    AuthModule,
  ],
})
export class AppModule {}
