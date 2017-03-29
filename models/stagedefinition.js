'use strict';
module.exports = function(sequelize, DataTypes) {
  var StageDefinition = sequelize.define('StageDefinition', {

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return StageDefinition;
};