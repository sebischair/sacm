'use strict';
module.exports = function(sequelize, DataTypes) {
  var CaseDefinition = sequelize.define('CaseDefinition', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CaseDefinition;
};