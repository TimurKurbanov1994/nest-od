import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TagEntity } from '../tag/tag.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public uid: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
  })
  public email: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
  })
  public nickname: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
  })
  public password: string;

  @OneToMany(() => TagEntity, (tag) => tag.creator, { cascade: true })
  tags: TagEntity[];

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hashedPassword;
  }
}
