import { Injectable } from '@nestjs/common';

import { PaginationDbHelper } from '@/common/helper/pagination.helper';
import { PortfolioImage } from '@/portfolios/models/portfolio-image.model';
import { PortfolioImagesPageDto } from '@/portfolios/dto/portfolio-images-page.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

@Injectable()
export class FeedService {
  constructor(private readonly portfolioImageService: PortfolioImagesService) {}

  async getFeed(query: PortfolioImagesPageDto) {
    const pagination = new PaginationDbHelper(query);
    const include = this.portfolioImageService.getIncludes({ portfolio: true });
    const images = await this.portfolioImageService.findMany(
      pagination,
      include,
    );
    const mappedData = images.models.map((image: PortfolioImage) => {
      return {
        image: image.fileName,
        description: image.description,
        portfolioName: image.portfolio.name,
        createdAt: image.createdAt,
      };
    });
    return { models: mappedData, count: images.count };
  }
}
