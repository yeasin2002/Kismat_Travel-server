import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";
import { threadId } from "worker_threads";

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
    try {
      const bookings = await db.Bookings.findAll();
      console.log("🚀 ~ file: booking.service.ts:24 ~ BookingService ~ getBookings ~ bookings:", bookings);
      return bookings.map(_v => _v.toJSON());
    } catch (error) {
      console.log("🚀 ~ file: booking.service.ts:31 ~ BookingService ~ getBookings ~ error:", error);
      throw error;
    }
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
