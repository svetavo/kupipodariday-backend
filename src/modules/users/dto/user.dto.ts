import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

export class FindUsersDto {
  @IsString()
  query: string;
}
