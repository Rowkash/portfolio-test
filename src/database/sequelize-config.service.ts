import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { IPostgresOptions } from '@/configs/postgres.config';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const options = this.configService.get<IPostgresOptions>('postgres');
    return {
      dialect: 'postgres',
      ...options,
      synchronize: false,
    };
  }
}
