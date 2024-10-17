"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Spots",
          key: "id",
        },
      },
      url: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      preview: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "SpotImage",
    }
  );
  return SpotImage;
};
