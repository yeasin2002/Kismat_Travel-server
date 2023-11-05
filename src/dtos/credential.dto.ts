import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CredentialCreateDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public apikey: string;
}

export class CredentialUpdateDto {
  @IsString()
  @IsOptional()
  public username?: string;

  @IsString()
  @IsOptional()
  public apikey?: string;
}
