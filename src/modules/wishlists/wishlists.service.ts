import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistDto } from './dto/wishlist.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly userService: UsersService,
  ) {}

  getWishlists() {
    return this.wishlistsRepository.find({ relations: ['owner', 'items'] });
  }

  async create(id: number, dto: WishlistDto): Promise<Wishlist> {
    const owner = await this.userService.findById(id);
    return this.wishlistsRepository.save({ ...dto, owner: owner });
  }

  async getWishListById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) throw new NotFoundException('Вишлист не найден');
    return wishlist;
  }

  async update(
    user,
    id: number,
    dto: WishlistDto,
  ): Promise<Wishlist | { message: string }> {
    const wishlist = await this.getWishListById(id);
    if (wishlist.owner.id !== user.id)
      return { message: 'Вы не можете редактировать чужой вишлист' };
    await this.wishlistsRepository.update(id, dto);
    return await this.getWishListById(id);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.wishlistsRepository.delete(id);
    return { message: 'Список желаний удален' };
  }
}
