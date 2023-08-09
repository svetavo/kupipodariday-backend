import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { FindUsersDto } from './dto/user.dto';
import { TUserReq } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: TUserReq) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req: TUserReq, @Body() dto: any) {
    return this.usersService.update(req.user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUser(@Param() params: any) {
    return this.usersService.findByName(params.username);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMyWishes(@Req() { user }) {
    return this.usersService.getWishesById(user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getWishes(@Param() params: any) {
    return this.usersService.getWishesByName(params.username);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findMany(@Body() dto: FindUsersDto) {
    return this.usersService.find(dto);
  }
}
