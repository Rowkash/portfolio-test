import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { PortfolioImagesPageDto } from '@/portfolios/dto/portfolio-images-page.dto';
import { FeedService } from '@/feed/feed.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  @Get()
  getFeed(@Query() query: PortfolioImagesPageDto) {
    return this.feedService.getFeed(query);
  }
}
