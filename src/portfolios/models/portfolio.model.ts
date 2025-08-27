import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
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
import { BaseModel } from '@/common/models/base.model';

@Exclude()
@Table({ tableName: 'portfolios' })
export class PortfolioModel extends BaseModel<
  InferAttributes<PortfolioModel>,
  InferCreationAttributes<PortfolioModel>
> {
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

  @Expose()
  @Type(() => PortfolioImageModel)
  @HasMany(() => PortfolioImageModel)
  images: CreationOptional<PortfolioImageModel[]>;
}
