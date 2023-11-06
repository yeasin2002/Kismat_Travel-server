import { hash } from "@utils/encryption";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface AdminModel extends Model<InferAttributes<AdminModel>, InferCreationAttributes<AdminModel>> {
  id: CreationOptional<string>;
  name: string;
  phone: string;
  email: string;
  password: string;
  sessions: string;
  photo: CreationOptional<string>;
  role: "SuperAdmin" | "Employee";
}

export function AdminModel(sequelize: Sequelize) {
  return sequelize.define<AdminModel>(
    "Admin",
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

      phone: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM("SuperAdmin", "Employee"),
        allowNull: false,
        defaultValue: "Employee",
      },
      photo: {
        type: DataTypes.STRING,
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
        set(value: string) {
          this.setDataValue("password", hash(value));
        },
      },

      sessions: {
        allowNull: true,
        type: DataTypes.STRING(255),
        set(value: string) {
          this.setDataValue("sessions", hash(value));
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
