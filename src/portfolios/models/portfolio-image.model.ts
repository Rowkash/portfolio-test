import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';

Exclude();
@Table({ tableName: 'images' })
export class PortfolioImageModel extends Model<
  InferAttributes<PortfolioImageModel>,
  InferCreationAttributes<PortfolioImageModel>
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
    example: 'This is my Portfolio image',
    description: `Portfolio image description`,
  })
  @Expose()
  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @ApiProperty({
    example: '55669cac-0213-4388-9b26-4b275643e653.jpeg',
    description: `Image file name`,
  })
  @Expose()
  @Column({ type: DataType.STRING, allowNull: false, field: 'file_name' })
  declare fileName: string;

  @ApiProperty({ type: () => PortfolioModel })
  @Expose()
  @Type(() => PortfolioModel)
  @BelongsTo(() => PortfolioModel)
  portfolio: CreationOptional<PortfolioModel>;

  @ApiProperty({ example: 1, description: 'Portfolio ID' })
  @ForeignKey(() => PortfolioModel)
  @Column({ type: DataType.INTEGER, field: 'portfolio_id' })
  declare portfolioId: number;

  @CreatedAt
  @Expose()
  @Column({ field: 'created_at', type: 'timestamp' })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Exclude()
  @Column({ field: 'updated_at', type: 'timestamp' })
  declare updatedAt: CreationOptional<Date>;
}
