import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Portfolio } from '@/portfolios/models/portfolio.model';
import { PortfoliosService } from '@/portfolios/portfolios.service';
import { PortfoliosController } from '@/portfolios/portfolios.controller';

@Module({
  imports: [SequelizeModule.forFeature([Portfolio])],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
})
export class PortfoliosModule {}
