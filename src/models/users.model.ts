import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<string>;
  email: string;
  password: string;
}

export function UserModel(sequelize: Sequelize) {
  return sequelize.define<UserModel>("User", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    email: {
      allowNull: false,
      type: DataTypes.STRING(45),
    },

    password: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
  });
}
