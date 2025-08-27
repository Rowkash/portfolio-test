import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { BaseModel } from '@/common/models/base.model';

@Exclude()
@Table({ tableName: 'users' })
export class UserModel extends BaseModel<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Expose()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'user_name',
  })
  userName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @Exclude()
  password: string;

  @ApiProperty({ type: [PortfolioModel], description: 'Portfolios array' })
  @Expose()
  @HasMany(() => PortfolioModel)
  portfolios?: CreationOptional<PortfolioModel[]>;
}
