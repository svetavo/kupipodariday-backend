import { Injectable } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreateOfferDto } from './dto/offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishDto } from '../wishes/dto/wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async findOffers() {
    const offers = await this.offersRepository.find({
      relations: ['user', 'item'],
    });
    offers.forEach((offer) => delete offer.user.password);
    return offers;
  }

  async create(
    id: number,
    dto: CreateOfferDto,
  ): Promise<Offer | { message: string }> {
    const user = await this.userService.findById(id);
    const wish = await this.wishesService.findById(user, dto.itemId);
    if (user.id === wish.owner.id)
      return { message: 'Нельзя скидываться на собственные подарки' };
    const raised = wish.raised + dto.amount;
    if (raised > wish.price)
      return {
        message: 'Сумма собранных средств не может превышать стоимость подарка',
      };
    await this.wishesService.update(user, wish.id, {
      raised: raised,
    } as UpdateWishDto);
    return this.offersRepository.save({ ...dto, user, item: wish });
  }

  getOffer(id: number) {
    return this.offersRepository.findOne({ where: { id } });
  }
}
