import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Portfolio, PortfolioModel } from '@/portfolios/models/portfolio.model';

export class User {
  constructor(partial: Partial<User>) {
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

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id?: number;

  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'user_name',
  })
  userName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ type: [Portfolio], description: 'Portfolios array' })
  @HasMany(() => PortfolioModel)
  portfolios?: PortfolioModel[];
}
