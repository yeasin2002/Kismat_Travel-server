import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";

@Service()
export class BookingService {
  public async createBooking(userId: string, bookingId: string, response: string, passengers: string) {
    const newBooking = await db.Bookings.create({
      bookingId,
      userId,
      response: JSON.stringify(response),
      passengers: JSON.stringify(passengers),
    });

    const merge = await db.Bookings.findOne({
      where: { id: newBooking.id },
    });

    return merge.toJSON();
  }

  public async getBookings() {
    const bookings = await db.Bookings.findAll({});

    return bookings.map(_v => _v.toJSON());
  }

  public async getBookingsByUserId(userId: string) {
    const userBookings = await db.Bookings.findAll({
      where: { userId },
    });

    return userBookings.map(_v => _v.toJSON());
  }

  public async deleteBookingById(preBookingId: string) {
    const booking = await db.Bookings.findOne({
      where: { id: preBookingId },
    });

    if (!booking) throw new HttpException(404, "Booking not found");

    await booking.destroy();

    return booking.toJSON();
  }
}
