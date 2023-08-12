import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { WishlistDto } from './dto/wishlist.dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWisslistById(@Param() params: any) {
    return this.wishlistsService.getWishListById(params.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  createWishlist(@Req() { user }, @Body() dto: WishlistDto) {
    return this.wishlistsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWishlist(
    @Req() { user },
    @Param() params: any,
    @Body() dto: WishlistDto,
  ) {
    return this.wishlistsService.update(user, params.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWishlist(@Param() params: any) {
    return this.wishlistsService.delete(params.id);
  }
}
