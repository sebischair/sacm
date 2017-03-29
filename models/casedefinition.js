'use strict';


module.exports = function(sequelize, DataTypes) {
  var CaseDefinition = sequelize.define('CaseDefinition', {
    name: DataTypes.STRING
  }, {

    // Class level methods
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    // Instance level methods
    instanceMethods: {
      gambo: function(ha){
        return {tid: this.name + '  --  ' + this.id};
      }
    }
  });


  return CaseDefinition;
};
