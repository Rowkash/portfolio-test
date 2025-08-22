import { Injectable } from '@nestjs/common';

import { PortfolioImagesPageDto } from '@/portfolios/dto/portfolio-images-page.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { PortfolioImageModel } from '@/portfolios/models/portfolio-image.model';

@Injectable()
export class FeedService {
  constructor(private readonly portfolioImageService: PortfolioImagesService) {}

  async getFeed(query: PortfolioImagesPageDto) {
    const { models, count } = await this.portfolioImageService.findMany(query);
    const mappedData = models.map((image: PortfolioImageModel) => {
      return {
        image: image.fileName,
        description: image.description,
        portfolioName: image.portfolio.name,
        createdAt: image.createdAt as Date,
      };
    });
    return { models: mappedData, count };
  }
}
