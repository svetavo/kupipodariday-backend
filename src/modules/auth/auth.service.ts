import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDtoSignin, AuthDtoSignup } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const bcrypt = require('bcrypt'); // eslint-disable-line

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async signup(dto: AuthDtoSignup) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.userService.create({
        username: dto.username,
        about: dto.about,
        avatar: dto.avatar,
        email: dto.email,
        password: hash,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException(`${error.detail}`);
      }
      return error;
    }
  }

  async signin(dto: AuthDtoSignin) {
    const user = await this.userService.findByName(dto.username);
    return this.userService.findById(user.id).then((user) => {
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return bcrypt
        .compare(dto.password, user.password)
        .then((matched: any) => {
          if (!matched) {
            throw new ForbiddenException('Неправильный username или пароль');
          }
          return this.signToken(user.id, user.email);
        });
    });
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET as string,
    });
    return { access_token: token };
  }
}
