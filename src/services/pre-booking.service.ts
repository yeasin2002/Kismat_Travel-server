import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";

@Service()
export class PreBookingService {
  public async createPreBooking(userId: string, searchId: string, response: string, passengers: string) {
    const newPreBooking = await db.PreBookings.create({ searchId, userId, response, passengers });

    const merge = await db.Bookings.findOne({
      where: { id: newPreBooking.id },
      attributes: { exclude: ["UserId", "userId"] },
      include: {
        all: true,
        nested: true,
      },
    });

    return merge.toJSON();
  }

  public async getPreBookings() {
    const bookings = await db.PreBookings.findAll({
      attributes: { exclude: ["UserId", "userId"] },
      include: {
        all: true,
        nested: true,
      },
    });

    return bookings.map(_v => _v.toJSON());
  }

  public async getPreBookingsByUserId(userId: string) {
    const userPreBookings = await db.PreBookings.findAll({
      where: { userId },
      attributes: { exclude: ["UserId", "userId"] },
      include: {
        all: true,
        nested: true,
      },
    });

    return userPreBookings.map(_v => _v.toJSON());
  }

  public async deletePreBookingById(preBookingId: string) {
    const preBooking = await db.PreBookings.findOne({
      where: { id: preBookingId },
      include: {
        all: true,
        nested: true,
      },
    });

    if (!preBooking) throw new HttpException(404, "PreBooking not found");

    await preBooking.destroy();

    return preBooking.toJSON();
  }
}
