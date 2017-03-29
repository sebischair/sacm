'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProcessDefinition = sequelize.define('ProcessDefinition', {
    name: DataTypes.STRING,
    isRepeatable: DataTypes.BOOLEAN,
    isMandatory: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProcessDefinition;
};