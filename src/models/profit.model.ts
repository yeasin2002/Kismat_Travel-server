import { bites } from "@utils/encryption";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface Profit_model extends Model<InferAttributes<Profit_model>, InferCreationAttributes<Profit_model>> {
  id: CreationOptional<string>;
  user_profit: string;
  agent_profit: string;

  createdAt?: Date;
  updatedAt?: Date;
}

// profit model

export function Profit_model(sequelize: Sequelize) {
  return sequelize.define<Profit_model>("profit", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    user_profit: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      set(value: string) {
        this.setDataValue("user_profit", bites(value));
      },
    },
    agent_profit: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      set(value: string) {
        this.setDataValue("agent_profit", bites(value));
      },
    },
  });
}
