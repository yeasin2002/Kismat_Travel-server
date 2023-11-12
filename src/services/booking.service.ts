import { db } from "@db";
import { Service } from "typedi";

@Service()
export class BookingService {
  public async createBooking(userId: string, bookingId: string) {
    const newBooking = await db.Bookings.create({ bookingId, userId });

    const merge = await db.Bookings.findOne({
      where: { id: newBooking.id },
      attributes: { exclude: ["UserId", "userId"] },
      include: {
        all: true,
        nested: true,
      },
    });

    return merge.toJSON();
  }

  public async getBookings() {
    const bookings = await db.Bookings.findAll({
      attributes: { exclude: ["UserId", "userId"] },
      include: {
        all: true,
        nested: true,
      },
    });

    return bookings.map(_v => _v.toJSON());
  }

  async getBookingsByUserId() {
    //
  }

  async deleteBookingById() {
    //
  }
}
