import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
