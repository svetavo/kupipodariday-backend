import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../auth/guard';
import { Wish } from './entities/wish.entity';
import { AddWishDto, UpdateWishDto } from './dto/wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesServis: WishesService) {}

  @Get('top')
  findTopWish() {
    return this.wishesServis.findTopWish();
  }

  @Get('last')
  findLastWish() {
    return this.wishesServis.findLastWish();
  }

  @UseGuards(JwtGuard)
  @Post()
  addWish(@Req() { user }, @Body() dto: AddWishDto): Promise<Wish> {
    return this.wishesServis.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findWish(@Req() { user }, @Param() params: any) {
    return this.wishesServis.findById(user, params.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
    @Req() { user },
    @Param() params: any,
    @Body() dto: UpdateWishDto,
  ) {
    return this.wishesServis.update(user, params.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(@Req() { user }, @Param() params: any): Promise<any> {
    return this.wishesServis.delete(user, params.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/copy')
  copyWish(@Req() { user }, @Param() params: any) {
    return this.wishesServis.copyWish(user, user.id, params.id);
  }
}
