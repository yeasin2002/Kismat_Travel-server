import { BelongsToMixin } from "@interfaces/sequelize";
import { UserModel } from "@models/users.model";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize, literal } from "sequelize";

export interface BookingModel extends BelongsToMixin<UserModel, string, "user"> {}
export interface BookingModel extends Model<InferAttributes<BookingModel>, InferCreationAttributes<BookingModel>> {
  id: CreationOptional<string>;
  bookingId: string;
  passengers: string;
  response: string;
  userId?: ForeignKey<string>;

  createdAt?: Date;
  updatedAt?: Date;
}

export function BookingModel(sequelize: Sequelize) {
  return sequelize.define<BookingModel>(
    "Booking",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      passengers: {
        type: DataTypes.JSON,
        allowNull: false,

        get() {
          return JSON.parse(this.getDataValue("passengers"));
        },

        validate: {
          jsonValidator(value: any) {
            try {
              JSON.parse(value);
            } catch (error) {
              throw new Error("Invalid JSON");
            }
          },
        },
      },

      response: {
        type: DataTypes.JSON,
        allowNull: false,

        get() {
          return JSON.parse(this.getDataValue("response"));
        },

        validate: {
          jsonValidator(value: any) {
            try {
              JSON.parse(value);
            } catch (error) {
              throw new Error("Invalid JSON");
            }
          },
        },
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["UserId", "userId"],
          include: [
            [literal("JSON_UNQUOTE(passengers)"), "passengers"],
            [literal("JSON_UNQUOTE(response)"), "response"],
          ],
        },
        include: {
          all: true,
        },
      },
    },
  );
}
