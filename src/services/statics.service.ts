import { db } from "@db";
import { createCurrentYearMonthDate, getDatesBetween, getStartDateAndEndDate } from "@utils/date";
import { Op, col, fn, literal, where } from "sequelize";
import { Service } from "typedi";

@Service()
export class StaticsService {
  public async createSearch(search: Record<string, any>) {
    const _search = await db.Searches.create({ search: JSON.stringify(search) });
    return _search.toJSON();
  }

  public async getSearches() {
    const attributes = db.Searches.getAttributes();

    const searches = await db.Searches.findAll({ order: [[attributes.createdAt.field, "DESC"]] });

    return searches.map(search => search.toJSON());
  }

  public async getSearchesCount() {
    return await db.Searches.count();
  }

  public async getTodaysSearches() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const attributes = db.Searches.getAttributes();

    return await db.Searches.findAll({
      where: {
        createdAt: {
          [Op.gte]: date,
        },
      },
      order: [[attributes.createdAt.field, "DESC"]],
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

  public async getCurrentWeekNewUserByDays() {
    const { currentDay, sevenDaysEgo } = getStartDateAndEndDate();

    const attributes = db.Users.getAttributes();

    const dailyCount = (
      await db.Users.findAll({
        attributes: [
          [fn("COUNT", literal("*")), "count"],
          [fn("DATE", col(attributes.createdAt.field)), "day"],
        ],
        where: {
          createdAt: {
            [Op.between]: [sevenDaysEgo, currentDay],
          },
        },
        group: [fn("DAY", col(attributes.createdAt.field))],
      })
    ).map(item => ({ day: item.get("day"), count: item.get("count") }));

    const countsByDate = Object.fromEntries(dailyCount.map(entry => [entry.day, entry.count]));

    const dateRange = getDatesBetween(sevenDaysEgo, currentDay);

    return dateRange.map(date => ({
      count: countsByDate[date] || 0,
      day: new Date(date).toLocaleDateString("en", { weekday: "long" }),
    }));
  }

  public async getCurrentWeekNewBookingsByDays() {
    const { currentDay, sevenDaysEgo } = getStartDateAndEndDate();

    const attributes = db.Bookings.getAttributes();

    const dailyCount = (
      await db.Bookings.unscoped().findAll({
        attributes: [
          [fn("COUNT", literal("*")), "count"],
          [fn("DATE", col(attributes.createdAt.field)), "day"],
        ],
        where: {
          createdAt: {
            [Op.between]: [sevenDaysEgo, currentDay],
          },
        },
        group: [fn("DAY", col(attributes.createdAt.field))],
      })
    ).map(item => ({ day: item.get("day"), count: item.get("count") }));

    const countsByDate = Object.fromEntries(dailyCount.map(entry => [entry.day, entry.count]));

    const dateRange = getDatesBetween(sevenDaysEgo, currentDay);

    return dateRange.map(date => ({
      count: countsByDate[date] || 0,
      day: new Date(date).toLocaleDateString("en", { weekday: "long" }),
    }));
  }

  public async getCurrentYearNewUsersByMonths() {
    const attributes = db.Users.getAttributes();

    const monthsCount = (
      await db.Users.findAll({
        attributes: [
          [fn("COUNT", literal("*")), "count"],
          [fn("DATE", col(attributes.createdAt.field)), "month"],
          [fn("MONTH", col(attributes.createdAt.field)), "num"],
        ],
        where: where(fn("YEAR", col(attributes.createdAt.field)), fn("YEAR", fn("CURRENT_DATE"))),
        group: [fn("MONTH", col(attributes.createdAt.field)), fn("YEAR", col(attributes.createdAt.field))],
      })
    ).map(item => ({ month: item.get("month"), count: item.get("count"), num: item.get("num") }));

    const countsByMonths = Object.fromEntries(monthsCount.map(entry => [entry.num, entry.count]));

    return Array(12)
      .fill(null)
      .map((_, index) => ({
        count: countsByMonths[index + 1] || 0,
        month: createCurrentYearMonthDate(index + 1).toLocaleDateString("en", { month: "long" }),
      }));
  }

  public async getCurrentYearNewBookingByMonths() {
    const attributes = db.Bookings.getAttributes();

    const monthsCount = (
      await db.Bookings.unscoped().findAll({
        attributes: [
          [fn("COUNT", literal("*")), "count"],
          [fn("DATE", col(attributes.createdAt.field)), "month"],
          [fn("MONTH", col(attributes.createdAt.field)), "num"],
        ],
        where: where(fn("YEAR", col(attributes.createdAt.field)), fn("YEAR", fn("CURRENT_DATE"))),
        group: [fn("MONTH", col(attributes.createdAt.field)), fn("YEAR", col(attributes.createdAt.field))],
      })
    ).map(item => ({ month: item.get("month"), count: item.get("count"), num: item.get("num") }));

    const countsByMonths = Object.fromEntries(monthsCount.map(entry => [entry.num, entry.count]));

    return Array(12)
      .fill(null)
      .map((_, index) => ({
        count: countsByMonths[index + 1] || 0,
        month: createCurrentYearMonthDate(index + 1).toLocaleDateString("en", { month: "long" }),
      }));
  }
}
