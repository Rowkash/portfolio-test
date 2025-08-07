import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Portfolio } from '@/portfolios/models/portfolio.model';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfoliosController } from '@/portfolios/controllers/portfolios.controller';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { FilesService } from '@/files/files.service';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { PortfolioImagesController } from '@/portfolios/controllers/portfolio-images.controller';

@Module({
  imports: [SequelizeModule.forFeature([Portfolio, PortfolioImageModel])],
  controllers: [PortfoliosController, PortfolioImagesController],
  providers: [PortfoliosService, PortfolioImagesService, FilesService],
})
export class PortfoliosModule {}
