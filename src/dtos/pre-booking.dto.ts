import { IsNotEmpty, IsString } from "class-validator";

export class PreBookingCreateDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public searchId: string;

  @IsString()
  @IsNotEmpty()
  public response: string;

  @IsString()
  @IsNotEmpty()
  public passengers: string;
}
