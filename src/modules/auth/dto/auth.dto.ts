import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';

export class AuthDtoSignup {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Length(2, 200)
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthDtoSignin {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
