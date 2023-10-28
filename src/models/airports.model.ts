import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface AirportModel extends Model<InferAttributes<AirportModel>, InferCreationAttributes<AirportModel>> {
  id: CreationOptional<string>;
  code: string;
  name: string;
  country: string;
}

export function AirportModel(sequelize: Sequelize) {
  return sequelize.define<AirportModel>("Airport", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    code: {
      allowNull: false,
      type: DataTypes.STRING(10),
      unique: true,
    },

    name: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },

    country: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
  });
}
