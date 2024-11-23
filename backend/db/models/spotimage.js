//Model SpotImage
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId'});
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Spots",
        key: "id",
      }
    },
    url: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    preview: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};