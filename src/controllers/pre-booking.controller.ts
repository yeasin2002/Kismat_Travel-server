import { PreBookingCreateDto } from "@dtos/pre-booking.dto";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { PreBookingService } from "@services/pre-booking.service";
import { Authorized, Body, Controller, CurrentUser, Delete, Get, Param, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/pre-booking")
@Service()
export class PreBookingController {
  constructor(public preBookingService: PreBookingService) {}

  @Authorized()
  @Post()
  @UseBefore(ValidationMiddleware(PreBookingCreateDto))
  async createPreBooking(@Body() data: PreBookingCreateDto, @CurrentUser() _user: User) {
    return this.preBookingService.createPreBooking(_user.id, data.searchId, data.response, data.passengers);
  }

  @Authorized()
  @Get()
  async getPreBookings() {
    return this.preBookingService.getPreBookings();
  }

  @Authorized()
  @Get("/:id")
  async getPreBookingsByUserId(@CurrentUser() _user: User) {
    return this.preBookingService.getPreBookingsByUserId(_user.id);
  }

  @Authorized()
  @Delete("/:id")
  async deletePreBookingById(@Param("id") preBookingId: string) {
    return this.preBookingService.deletePreBookingById(preBookingId);
  }
}
