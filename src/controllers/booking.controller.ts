import { BookingCreateDto } from "@dtos/booking.dto";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { BookingService } from "@services/booking.service";
import { Body, Controller, Delete, Get, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/booking")
@Service()
export class BookingController {
  constructor(public bookingService: BookingService) {}

  @Post()
  @UseBefore(ValidationMiddleware(BookingCreateDto))
  async createBooking(@Body() data: BookingCreateDto) {
    return this.bookingService.createBooking(data.userId, data.bookingId);
  }

  @Get()
  async getBookings() {
    //
  }

  @Get("/:id")
  async getBookingsByUserId() {
    //
  }

  @Delete("/:id")
  async deleteBookingById() {
    //
  }
}
