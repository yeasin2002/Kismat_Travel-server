import { BelongsToMixin } from "@interfaces/sequelize";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

import { UserModel } from "@models/users.model";

export interface BookingModel extends BelongsToMixin<UserModel, number, "user"> {}
export interface BookingModel extends Model<InferAttributes<BookingModel>, InferCreationAttributes<BookingModel>> {
  id: CreationOptional<string>;
  bookingId: string;
  userId?: ForeignKey<string>;
}

export function BookingModel(sequelize: Sequelize) {
  return sequelize.define<BookingModel>("Booking", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    bookingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
