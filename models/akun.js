'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class akun extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      akun.hasOne(models.blog)
      // define association here
    }
  }
  akun.init({
    username: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    isVerified: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    imageUrl: {
      type: DataTypes.STRING,

    }
  }, {
    sequelize,
    modelName: 'akun',
    freezeTableName: true
  });
  return akun;
};