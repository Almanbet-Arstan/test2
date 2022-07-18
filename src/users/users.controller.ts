import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Delete('users')
  deleteUser(@Body() dto: CreateUserDto) {
    return this.usersService.deleteUser(dto);
  }
}
