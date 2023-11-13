import { HasOneMixin } from "@interfaces/sequelize";
import { BookingModel } from "@models/booking.model";
import { hash } from "@utils/encryption";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { PreBookingModel } from "./prebooking.model";

export interface UserModel extends HasOneMixin<PreBookingModel, string, "prebooking"> {}
export interface UserModel extends HasOneMixin<BookingModel, string, "booking"> {}
export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<string>;
  email: string;
  password: string;
  name: string;
  photoUrl: CreationOptional<string>;
}

export function UserModel(sequelize: Sequelize) {
  return sequelize.define<UserModel>(
    "User",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },

      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      photoUrl: {
        type: DataTypes.STRING,
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
        set(value: string) {
          this.setDataValue("password", hash(value));
        },
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    },
  );
}
