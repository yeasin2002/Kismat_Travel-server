import { IsNotEmpty, IsString } from "class-validator";

export class PreBookingCreateDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public searchId: string;

  @IsNotEmpty()
  public response: string;

  @IsNotEmpty()
  public passengers: string;
}
