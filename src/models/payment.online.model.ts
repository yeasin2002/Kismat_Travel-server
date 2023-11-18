// import { hash } from "@utils/encryption";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, literal } from "sequelize";

export interface Payment_online_options extends Model<InferAttributes<Payment_online_options>, InferCreationAttributes<Payment_online_options>> {
  id: CreationOptional<string>;
  name: string;
  status: string;
  amount_original: string;
  currency_merchant: string;
  cus_email: string;
  store_amount: string;
  all_data: string;
}

export function Payment_online(sequelize: Sequelize) {
  return sequelize.define<Payment_online_options>(
    "payment_online",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      cus_email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      amount_original: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      store_amount: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      currency_merchant: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      status: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },

      all_data: {
        type: DataTypes.JSON,
        allowNull: false,

        get() {
          return JSON.parse(this.getDataValue("all_data"));
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
          include: [[literal("JSON_UNQUOTE(all_data)"), "all_data"]],
        },
        include: {
          all: true,
        },
      },
    },
  );
}
