import { BadRequestException, Injectable } from '@nestjs/common';
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

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<User | { message: string }> {
    const user = await this.findById(id);
    if (dto.username && dto.username !== user.username) {
      const username = dto.username;
      const usernameExist = await this.usersRepository.findOne({
        where: { username },
      });
      if (usernameExist)
        throw new BadRequestException(
          'Пользователь с таким юзернеймом уже зарегистрирован',
        );
    }
    if (dto.email && dto.email !== user.email) {
      const emailExist = await this.findByEmail(dto.email);
      if (emailExist)
        throw new BadRequestException(
          'Пользователь с таким email уже зарегистрирован',
        );
    }
    if (dto.password) {
      const hash = await bcrypt.hash(dto.password, 10);
      await this.usersRepository.update(id, { password: hash });
      const userUpd = await this.findById(id);
      delete userUpd.password;
      return userUpd;
    }
    await this.usersRepository.update(id, dto);
    const userUpd = await this.findById(id);
    delete userUpd.password;
    return userUpd;
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

  async find(dto: FindUsersDto): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [
        { username: Like(`%${dto.query}%`) },
        { email: Like(`%${dto.query}%`) },
      ],
    });
    users.forEach((user) => delete user.password);
    return users;
  }
}
