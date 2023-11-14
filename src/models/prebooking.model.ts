import { BelongsToMixin } from "@interfaces/sequelize";
import { UserModel } from "@models/users.model";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize, literal } from "sequelize";

export interface PreBookingModel extends BelongsToMixin<UserModel, string, "user"> {}
export interface PreBookingModel extends Model<InferAttributes<PreBookingModel>, InferCreationAttributes<PreBookingModel>> {
  id: CreationOptional<string>;
  searchId: string;
  passengers: string;
  response: string;
  userId?: ForeignKey<string>;
}

export function PreBookingModel(sequelize: Sequelize) {
  return sequelize.define<PreBookingModel>(
    "prebooking",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      searchId: {
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
            if (typeof value === "string") return JSON.parse(value);
            if (!(value instanceof Object)) throw new Error("!!!Invalid JSON");
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
            if (typeof value === "string") return JSON.parse(value);
            if (!(value instanceof Object)) throw new Error("!!!Invalid JSON");
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
