import { db } from "@db";
import { getDatesBetween } from "@utils/getDatesBetween";
import { getStartDateAndEndDate } from "@utils/getStartDateAndEndDate";
import { Op, col, fn, literal } from "sequelize";
import { Service } from "typedi";

@Service()
export class StaticsService {
  public async createSearch(search: Record<string, any>) {
    return await db.Searches.create({ search: JSON.stringify(search) });
  }

  public async getSearches() {
    return await db.Searches.findAll({ order: [["createdAt", "DESC"]] });
  }

  public async getSearchesCount() {
    return await db.Searches.count();
  }

  public async getTodaysSearches() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await db.Searches.findAll({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
      order: [["createdAt", "DESC"]],
    });
  }

  public async getTodaysSearchesCount() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await db.Searches.count({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
    });
  }

  public async getTodaysUserSignupCount() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await db.Users.count({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
    });
  }

  public async getTodaysBookingsCount() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await db.Bookings.count({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
    });
  }

  public async getTodaysPreBookingsCount() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return await db.PreBookings.count({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
    });
  }

  public async getCurrentWeekBookingsByDays() {
    const { currentDay, sevenDaysEgo } = getStartDateAndEndDate();

    const dailyCount = (
      await db.Users.findAll({
        attributes: [
          [fn("COUNT", literal("*")), "count"],
          [fn("DATE", col("created_at")), "day"],
        ],
        where: {
          createdAt: {
            [Op.between]: [sevenDaysEgo, currentDay],
          },
        },
        group: [fn("DAY", col("created_at"))],
      })
    ).map(item => ({ day: item.get("day"), count: item.get("count") }));

    const countsByDate = Object.fromEntries(dailyCount.map(entry => [entry.day, entry.count]));

    const dateRange = getDatesBetween(sevenDaysEgo, currentDay);

    return dateRange.map(date => ({
      count: countsByDate[date] || 0,
      day: new Date(date).toLocaleDateString("en", { weekday: "long" }),
    }));
  }
}
