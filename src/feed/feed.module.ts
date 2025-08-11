import { Module } from '@nestjs/common';
import { FeedService } from '@/feed/feed.service';
import { FeedController } from '@/feed/feed.controller';
import { PortfoliosModule } from '@/portfolios/portfolios.module';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';

@Module({
  imports: [PortfoliosModule],
  controllers: [FeedController],
  providers: [PortfolioImagesService, FeedService],
})
export class FeedModule {}
