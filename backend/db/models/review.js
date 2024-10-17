"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Review.init(
    {
      spotId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Spots",
          key: "id",
        },
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      review: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      stars: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
