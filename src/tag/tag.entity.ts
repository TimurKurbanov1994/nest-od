import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tag')
export class TagEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
  })
  public name: string;

  @ManyToOne(() => UserEntity, (user) => user.uid, {
    onDelete: 'CASCADE',
  })
  creator?: UserEntity;

  @ApiProperty({ type: Number })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  public sortOrder: number;
}
