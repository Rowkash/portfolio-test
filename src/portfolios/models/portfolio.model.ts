import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { UserModel } from '@/users/models/user.model';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';

export class Portfolio {
  constructor(partial: Partial<Portfolio>) {
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
}

@Table({
  tableName: 'portfolios',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class PortfolioModel extends Model<
  InferAttributes<PortfolioModel>,
  InferCreationAttributes<PortfolioModel>
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

  @ApiProperty({ type: () => UserModel })
  @BelongsTo(() => UserModel)
  user: CreationOptional<UserModel>;

  @ApiProperty({ example: 5, description: 'User ID' })
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  declare userId: number;

  @HasMany(() => PortfolioImageModel)
  images: CreationOptional<PortfolioImageModel[]>;
}
