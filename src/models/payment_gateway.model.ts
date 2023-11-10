import { bites } from "@utils/encryption";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface Payment_gatewayModel extends Model<InferAttributes<Payment_gatewayModel>, InferCreationAttributes<Payment_gatewayModel>> {
  id: CreationOptional<string>;
  store_id: string;
  status: string;
}

export function Payment_gatewayModel(sequelize: Sequelize) {
  return sequelize.define<Payment_gatewayModel>("payment_gateway", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    store_id: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      set(value: string) {
        this.setDataValue("store_id", bites(value));
      },
    },

    status: {
      allowNull: false,
      type: DataTypes.ENUM("LIVE", "SANDBOX"),
      unique: true,
    },
  });
}
