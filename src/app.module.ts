import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BookingsModule } from './booking/booking.module';

@Module({
  imports: [UsersModule, CarsModule, BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
