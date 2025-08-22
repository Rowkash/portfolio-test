import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PortfolioModel } from '@/portfolios/models/portfolio.model';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfoliosController } from '@/portfolios/controllers/portfolios.controller';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { PortfolioImagesController } from '@/portfolios/controllers/portfolio-images.controller';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    SequelizeModule.forFeature([PortfolioModel, PortfolioImageModel]),
    FilesModule,
  ],
  controllers: [PortfoliosController, PortfolioImagesController],
  providers: [PortfoliosService, PortfolioImagesService],
  exports: [PortfoliosService, PortfolioImagesService],
})
export class PortfoliosModule {}
