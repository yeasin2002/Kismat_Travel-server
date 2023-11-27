import { User } from "@interfaces/users.interface";
import { isAdmin } from "@middlewares/isAdmin.middleware";
import { BookingService } from "@services/booking.service";
import { Authorized, Body, Controller, CurrentUser, Delete, Get, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/booking")
@Service()
export class BookingController {
  constructor(public bookingService: BookingService) {}

  // @Authorized()
  // @Post()
  // @UseBefore(ValidationMiddleware(BookingCreateDto))
  // async createBooking(@Body() data: BookingCreateDto, @CurrentUser() _user: User) {
  //   return this.bookingService.createBooking(_user.id, data.bookingId, data.response, data.passengers);
  // }

  @Post()
  @UseBefore(isAdmin)
  async getBookings() {
    return this.bookingService.getBookings();
  }

  @Authorized()
  @Get("/:id")
  async getBookingsByUserId(@CurrentUser() _user: User) {
    return this.bookingService.getBookingsByUserId(_user.id);
  }

  @Authorized()
  @Delete("/:id")
  async deleteBookingById(@CurrentUser() _user: User) {
    return this.bookingService.deleteBookingById(_user.id);
  }
}
