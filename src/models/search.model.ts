import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, literal } from "sequelize";

export interface SearchModel extends Model<InferAttributes<SearchModel>, InferCreationAttributes<SearchModel>> {
  id: CreationOptional<string>;
  search: string;
  createdAt?: Date;
}

export function SearchModel(sequelize: Sequelize) {
  return sequelize.define<SearchModel>(
    "Search",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      search: {
        allowNull: false,
        type: DataTypes.JSON,

        get() {
          return JSON.parse(this.getDataValue("search"));
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
      timestamps: true,
      updatedAt: false,
      defaultScope: {
        attributes: {
          include: [[literal("JSON_UNQUOTE(search)"), "search"]],
        },
      },
    },
  );
}
