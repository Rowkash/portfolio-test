import { Module } from '@nestjs/common';
import { SessionsService } from '@/sessions/sessions.service';

@Module({
  imports: [],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
