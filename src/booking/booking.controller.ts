import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { BookingsService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DeleteBookingDto } from './dto/delete-booking.dto';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('getAll')
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @Get('info')
  getBookingInfo() {
    return this.bookingsService.getAllCarsBookingInfo();
  }

  @Get('booking/:id')
  checkBooking(@Param() params) {
    return this.bookingsService.checkBooking(params.id);
  }

  @Post('addBooking')
  addBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }

  @Delete('deleteBooking')
  deleteBooking(@Body() dto: DeleteBookingDto) {
    return this.bookingsService.deleteBooking(dto);
  }
}
