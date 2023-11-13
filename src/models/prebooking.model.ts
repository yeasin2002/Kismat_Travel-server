import { BelongsToMixin } from "@interfaces/sequelize";
import { UserModel } from "@models/users.model";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface PreBookingModel extends BelongsToMixin<UserModel, string, "user"> {}
export interface PreBookingModel extends Model<InferAttributes<PreBookingModel>, InferCreationAttributes<PreBookingModel>> {
  id: CreationOptional<string>;
  searchId: string;
  presagers: string;
  response: string;
  userId?: ForeignKey<string>;
}

export function PreBookingModel(sequelize: Sequelize) {
  return sequelize.define<PreBookingModel>("prebooking", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    searchId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    presagers: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        jsonValidator(value: string) {
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
      validate: {
        jsonValidator(value: string) {
          try {
            JSON.parse(value);
          } catch (error) {
            throw new Error("Invalid JSON");
          }
        },
      },
    },
  });
}
