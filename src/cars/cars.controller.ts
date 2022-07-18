import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('cars')
  getCars() {
    return this.carsService.getCars();
  }

  @Post('cars')
  createCar(@Body() dto: CreateCarDto) {
    return this.carsService.createCar(dto);
  }

  @Delete('cars')
  editCar(@Body() dto: CreateCarDto) {
    return this.carsService.deleteCar(dto);
  }
}
