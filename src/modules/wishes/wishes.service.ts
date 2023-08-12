import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AddWishDto, UpdateWishDto } from './dto/wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(id: number, dto: AddWishDto): Promise<Wish> {
    const user = await this.userService.findById(id);
    const wish = await this.wishesRepository.save({ ...dto, owner: user });
    return wish;
  }

  async findById(user, id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new NotFoundException('Такое желание не найдено');
    if (user.id !== wish.owner.id) {
      delete wish.raised;
      delete wish.copied;
    }
    delete wish.owner.password;
    wish.offers.forEach((offer) => delete offer.user.password);
    return wish;
  }

  async update(
    user,
    id: number,
    dto: UpdateWishDto,
  ): Promise<Wish | { message: string }> {
    const wish = await this.findById(user, id);
    if (user && wish.owner.id !== user.id)
      return { message: 'Вы не можете удалить чужое желание' };
    if (wish.offers.length)
      return {
        message:
          'Вы не можете изменить стоимость подарка, сбор средств на который уже начался',
      };
    await this.wishesRepository.update(id, dto);
    return await this.wishesRepository.findOne({ where: { id } });
  }

  async delete(user, id: number): Promise<{ message: string }> {
    const wish = await this.findById(user, id);
    if (user && wish.owner.id !== user.id)
      return { message: 'Вы не можете удалить чужое желание' };
    if (wish.offers.length >= 1)
      return {
        message:
          'Вы не можете удалить желание, сбор средств на которое уже начался',
      };
    await this.wishesRepository.delete(id);
    return { message: 'Желание удалено' };
  }

  async copyWish(user, userId: number, id: number): Promise<Wish> {
    const wish = await this.findById(user, id);
    const owner = await this.userService.findById(userId);
    await this.wishesRepository.update(id, { copied: wish.copied + 1 });
    delete wish.owner.password;
    return this.wishesRepository.save({ ...wish, owner });
  }

  async findLastWish(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers', 'offers.user'],
    });
    wishes.forEach((wish) => delete wish.owner.password);
    wishes.forEach((wish) => delete wish.offers);

    return wishes;
  }

  async findTopWish(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner', 'offers', 'offers.user'],
    });
    wishes.forEach((wish) => delete wish.owner.password);
    wishes.forEach((wish) => delete wish.offers);
    return wishes;
  }
}
