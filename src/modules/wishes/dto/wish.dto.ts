import { IsNumber, IsPositive, IsString, IsUrl, Length, IsOptional } from 'class-validator';

export class AddWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @Length(1, 1024)
  description: string;

  @IsNumber()
  @IsOptional()
  copied?: number;

  @IsNumber()
  @IsOptional()
  raised?: number;
}
