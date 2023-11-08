import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public password: string;
}

export class UserNameDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class SingInUserDto extends UserPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class CreateUserDto extends SingInUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdatePasswordDto extends UserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public current: string;
}
