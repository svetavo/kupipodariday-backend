import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CreateOfferDto } from './dto/offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Get()
  getOffers() {
    return this.offersService.findOffers();
  }

  @UseGuards(JwtGuard)
  @Post()
  postOffer(@Req() { user }, @Body() dto: CreateOfferDto) {
    return this.offersService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOffer(@Param() params: any) {
    return this.offersService.getOffer(params.id);
  }
}
