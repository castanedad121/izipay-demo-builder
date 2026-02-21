import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Config = sequelize.define(
  "Config",
  {
    clientName: { type: DataTypes.STRING, allowNull: false },
    storeName: { type: DataTypes.STRING, allowNull: false },

    logoUrl: { type: DataTypes.STRING },
    primaryColor: { type: DataTypes.STRING, defaultValue: "#ba0352" },

    // Productos embebidos
    products: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [], // [{id,name,price,size,color,imageUrl}]
    },
  },
  { tableName: "configs" },
);
