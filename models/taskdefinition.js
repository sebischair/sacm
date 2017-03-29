'use strict';
module.exports = function(sequelize, DataTypes) {
  var TaskDefinition = sequelize.define('TaskDefinition', {
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TaskDefinition;
};