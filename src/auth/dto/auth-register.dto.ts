import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Jack' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  userName: string;

  @ApiProperty({ example: 'password' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
