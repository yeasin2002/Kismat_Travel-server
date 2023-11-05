import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface CredentialModel extends Model<InferAttributes<CredentialModel>, InferCreationAttributes<CredentialModel>> {
  id: CreationOptional<string>;
  key: CreationOptional<string>;
  username: string;
  apikey: string;
}

export function CredentialModel(sequelize: Sequelize) {
  return sequelize.define<CredentialModel>("Credential", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    apikey: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "@api-key",
    },
  });
}
