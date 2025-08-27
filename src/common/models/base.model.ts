import {
  Column,
  CreatedAt,
  DataType,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CreationOptional } from 'sequelize';

export abstract class BaseModel<
  TModelAttributes extends object = any,
  TCreationAttributes extends object = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Expose()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

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
}
