import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { Portfolio, PortfolioModel } from '@/portfolios/models/portfolio.model';

export class PortfolioImage {
  constructor(partial: Partial<PortfolioImage>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 1, description: 'Portfolio ID' })
  @Exclude()
  portfolioId: number;

  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: '55669cac-0213-4388-9b26-4b275643e653.jpeg',
    description: `Image file name`,
  })
  @Expose()
  fileName: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: () => Portfolio })
  portfolio: Portfolio;
}

@Table({
  tableName: 'images',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class PortfolioImageModel extends Model<
  InferAttributes<PortfolioImageModel>,
  InferCreationAttributes<PortfolioImageModel>
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

  @Column({ type: DataType.STRING, allowNull: false, field: 'file_name' })
  declare fileName: string;

  @BelongsTo(() => PortfolioModel)
  portfolio: CreationOptional<Portfolio>;

  @ForeignKey(() => PortfolioModel)
  @Column({ type: DataType.INTEGER, field: 'portfolio_id' })
  declare portfolioId: number;
}
