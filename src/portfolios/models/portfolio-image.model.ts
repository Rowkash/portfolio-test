import {
  Column,
  DataType,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { BaseModel } from '@/common/models/base.model';

@Exclude()
@Table({ tableName: 'images' })
export class PortfolioImageModel extends BaseModel<
  InferAttributes<PortfolioImageModel>,
  InferCreationAttributes<PortfolioImageModel>
> {
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
  @Exclude()
  @Column({ type: DataType.STRING, allowNull: false, field: 'file_name' })
  declare fileName: string;

  @ApiProperty({
    example:
      'http://localhost:9000/storage/a74378d9-251d-4447-a669-74e8c5f8cc9a',
    description: `Image url`,
  })
  @Expose()
  @Column({ type: DataType.STRING, allowNull: false })
  declare url: string;

  @ApiProperty({ type: () => PortfolioModel })
  @Expose()
  @Type(() => PortfolioModel)
  @BelongsTo(() => PortfolioModel)
  portfolio: CreationOptional<PortfolioModel>;

  @ApiProperty({ example: 1, description: 'Portfolio ID' })
  @ForeignKey(() => PortfolioModel)
  @Column({ type: DataType.INTEGER, field: 'portfolio_id' })
  declare portfolioId: number;
}
