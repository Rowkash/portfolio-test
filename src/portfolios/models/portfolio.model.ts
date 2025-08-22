import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { UserModel } from '@/users/models/user.model';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';

@Exclude()
@Table({ tableName: 'portfolios' })
export class PortfolioModel extends Model<
  InferAttributes<PortfolioModel>,
  InferCreationAttributes<PortfolioModel>
> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Expose()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id?: number;

  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @Expose()
  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @ApiProperty({ type: () => UserModel })
  @BelongsTo(() => UserModel)
  user: CreationOptional<UserModel>;

  @ApiProperty({ example: 5, description: 'User ID' })
  @Expose()
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  declare userId: number;

  @ApiProperty({
    description: 'Timestamps of model creation',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Expose()
  @CreatedAt
  @Column({ field: 'created_at', type: 'timestamp' })
  declare createdAt: CreationOptional<Date>;

  @ApiProperty({
    description: 'Timestamps of model updation',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Exclude()
  @UpdatedAt
  @Column({ field: 'updated_at', type: 'timestamp' })
  declare updatedAt: CreationOptional<Date>;

  @Expose()
  @Type(() => PortfolioImageModel)
  @HasMany(() => PortfolioImageModel)
  images: CreationOptional<PortfolioImageModel[]>;
}
