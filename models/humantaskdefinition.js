'use strict';
module.exports = function(sequelize, DataTypes) {
  var HumanTaskDefinition = sequelize.define('HumanTaskDefinition', {
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return HumanTaskDefinition;
};