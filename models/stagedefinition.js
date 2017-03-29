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

      /**
        Creates as new StageDefinition and the corresponding ProcessDefinition
      **/
      createStage: function(arg) {
        console.log(ProcessDefinition);
        var self = this;
        return ProcessDefinition.create(arg)
          .then(processDef => {
            arg.processId = processDef.id;
            return [processDef, self.create(arg)];
          })
          .spread((processDef, stageDef) => {
            // Compose stage
            return {
              process: processDef,
              stage:  stageDef
            };
          })
      }

    },

    instanceMethods: {

      /*
        Get SubStageDefinitions of StageDefinition
      */

      getSubStages: function() {

        var getAsyncProcessDefinition = function(stageDefinition) {
          return ProcessDefinition.findOne({where:{id: stageDefinition.processId}});
        }

        var stageDefinitionsInstance = [];
        return StageDefinition.findAll({where: {parentId: this.id}})
        .then((stageDefinitions) => {
          stageDefinitionsInstance = stageDefinitions;
          return Promise.all(stageDefinitions.map(getAsyncProcessDefinition));
        })
        .then((processDefinitions) => {

          var subStages = [];
          processDefinitions.forEach((value) => {

            var innerStage = null;
            stageDefinitionsInstance.forEach((stage) => {
              if(stage.processId == value.id) {
                innerStage = stage;
              }
            })

            if(innerStage != null){
              subStages.push({
                process: value,
                stage: innerStage
              })
            }

          });


          return subStages;
        })
      }
    }
  });
  return StageDefinition;
};
