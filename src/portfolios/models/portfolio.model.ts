import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { User } from '@/users/models/user.model';

export class PortfolioModelDto {
  constructor(partial: Partial<PortfolioModelDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  user?: User;
}

@Table({ tableName: 'portfolios' })
export class Portfolio extends Model<
  InferAttributes<Portfolio>,
  InferCreationAttributes<Portfolio>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @ApiProperty({ type: () => User })
  @BelongsTo(() => User)
  user?: User;

  @ApiProperty({ example: 5, description: 'User ID' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  declare userId: number;
}
