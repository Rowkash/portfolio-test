import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as path from 'path';

import appConfig from '@/configs/app.config';
import authConfig from '@/configs/auth.config';
import { AuthModule } from '@/auth/auth.module';
import postgresConfig from '@/configs/postgres.config';
import { SessionsModule } from '@/sessions/sessions.module';
import { DatabasesModule } from '@/database/databases.module';
import { CacheConfigService } from '@/configs/cache-config.service';
import { AuthMiddleware } from '@/common/middlewares/auth.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from '@/files/files.module';
import { UsersModule } from '@/users/users.module';
import { PortfoliosModule } from '@/portfolios/portfolios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.production.env', '.development.env'],
      load: [appConfig, postgresConfig, authConfig],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('static'),
      serveRoot: '/static',
    }),
    DatabasesModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    PortfoliosModule,
    FilesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
