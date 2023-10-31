'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
    underscored: true,
    underscoreAll: true,
    freezeTableName: true,
    createAt: "created_at",
    updateAt: "updated_at"
  });
  return Products;
};