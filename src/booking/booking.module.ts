import { Module } from '@nestjs/common';
import { BookingsService } from './booking.service';
import { BookingsController } from './booking.controller';
import { DbModule } from '../db/db.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [DbModule],
})
export class BookingsModule {}
