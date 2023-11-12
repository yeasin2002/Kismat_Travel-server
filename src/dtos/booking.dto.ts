import { IsNotEmpty, IsString } from "class-validator";

export class BookingCreateDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public bookingId: string;
}
