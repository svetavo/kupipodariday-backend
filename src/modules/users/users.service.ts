import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { AuthDtoSignup } from '../auth/dto/auth.dto';
import { FindUsersDto, UpdateUserDto } from './dto/user.dto';

const bcrypt = require('bcrypt'); // eslint-disable-line

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    delete user.password;
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findByName(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    delete user.password;
    return user;
  }

  async create(dto: AuthDtoSignup): Promise<AuthDtoSignup> {
    return this.usersRepository.save(dto);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | { message: string }> {
    const hash = await bcrypt.hash(dto.password, 10);
    await this.usersRepository.update(id, {
      username: dto.username,
      avatar: dto.avatar,
      about: dto.about,
      password: hash,
    });
    const user = await this.findById(id);
    return user;
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.usersRepository.delete(id);
    return { message: 'Пользователь удален' };
  }

  async getWishesById(id: number): Promise<Wish[]> {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes'],
    });
    return wishes;
  }

  async getWishesByName(username: string): Promise<Wish[]> {
    const { wishes } = await this.usersRepository.findOne({
      where: { username },
      select: ['wishes'],
      relations: ['wishes'],
    });
    return wishes;
  }

  find(dto: FindUsersDto): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ username: Like(`%${dto.query}%`) }, { email: Like(`%${dto.query}%`) }],
    });
  }
}
