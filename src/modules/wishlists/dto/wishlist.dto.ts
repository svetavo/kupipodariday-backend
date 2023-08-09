import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class WishlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;
}
