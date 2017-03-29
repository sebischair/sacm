'use strict';

import models from './../models';



module.exports = function(sequelize, DataTypes) {
  const ProcessDefinition = sequelize.models.ProcessDefinition;
  var StageDefinition = sequelize.define('StageDefinition', {
    processId: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      createStage: function(arg) {
        console.log(ProcessDefinition);
        var self = this;
        var processDefinitionInstance;
        return ProcessDefinition.create(arg)
        .then((processDefinition) => {
          processDefinitionInstance = processDefinition;
          arg.processId = processDefinition.id;
          return self.create(arg);
        })
        .then((stageDefinition) => {

          // Compose stage
          let result = {
            id: processDefinitionInstance.id,
            stageId: stageDefinition.id,
            parentId: stageDefinition.parentId,
            name: processDefinitionInstance.name,
            createdAt: stageDefinition.createdAt,
            updatedAt: stageDefinition.updatedAt
          };

          return result;
        })
      }
    }
  });
  return StageDefinition;
};
