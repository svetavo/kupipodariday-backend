import { IsOptional, IsString, IsUrl } from 'class-validator';

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
}

export class FindUsersDto {
  @IsString()
  query: string;
}
