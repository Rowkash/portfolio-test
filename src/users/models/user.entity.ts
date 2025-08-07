import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Portfolio } from '@/portfolios/models/portfolio.model';

export class UserDto {
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  userName: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

@Table({ tableName: 'users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id?: number;

  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  userName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ type: [Portfolio], description: 'Portfolios array' })
  @HasMany(() => Portfolio)
  portfolios?: Portfolio[];
}
