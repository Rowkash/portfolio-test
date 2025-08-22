import { Module } from '@nestjs/common';

import { FeedService } from '@/feed/feed.service';
import { FeedController } from '@/feed/feed.controller';
import { PortfoliosModule } from '@/portfolios/portfolios.module';

@Module({
  imports: [PortfoliosModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
