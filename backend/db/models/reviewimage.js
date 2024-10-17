"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  ReviewImage.init(
    {
      reviewId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Reviews",
          key: "id",
        },
      },
      url: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};
