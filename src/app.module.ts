import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import appConfig from '@/configs/app.config';
import { DatabasesModule } from '@/database/databases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.production.env', '.development.env'],
      load: [appConfig],
    }),
    DatabasesModule,
  ],
})
export class AppModule {}
