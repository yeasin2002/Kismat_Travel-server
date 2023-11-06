import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AdminPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public password: string;
}

export class LoginAdminDto extends AdminPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class CreateAdminDto extends LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdatePasswordDto extends AdminPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public "current-password": string;
}
