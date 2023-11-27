import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";

@Service()
export class PreBookingService {
  public async createPreBooking(userId: string, searchId: string, response: string, passengers: string) {
    const newPreBooking = await db.PreBookings.create({
      searchId,
      userId,
      response: JSON.stringify(response),
      passengers: JSON.stringify(passengers),
    });

    const merge = await db.PreBookings.findOne({
      where: { id: newPreBooking.id },
    });

    return merge.toJSON();
  }

  public async getPreBookings() {
    const preBookings = await db.PreBookings.findAll();

    return preBookings.map(_v => _v.toJSON());
  }

  public async getPreBookingsByUserId(userId: string) {
    const userPreBookings = await db.PreBookings.findAll({
      where: { userId },
    });
    return userPreBookings.map(_v => _v.toJSON());
  }

  public async deletePreBookingById(preBookingId: string) {
    const preBooking = await db.PreBookings.findOne({
      where: { id: preBookingId },
    });
    if (!preBooking) throw new HttpException(404, "PreBooking not found");
    await preBooking.destroy();
    return preBooking.toJSON();
  }
}
