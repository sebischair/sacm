'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import xml2js from 'xml2js';
const fs = Promise.promisifyAll(require("fs"));
const xml2jspromise = Promise.promisifyAll(xml2js);

module.exports = class ModelAnalytics{



  static analyze(){    
    let result = {
      entityDefinitions:{},
      stageDefinitions:{}
    };
    try{
      let filePath = 'app/importer/studyrelease.case.groningen.cs2.xml';
      xml2jspromise.parseStringAsync(fs.readFileSync(filePath).toString(), {explicitChildren:true, preserveChildrenOrder:true})
      .then(xml=>{
        let Workspace =  xml.SACMDefinition.Workspace[0];
        let CaseDefinition = Workspace.CaseDefinition[0];

              
        let helperSumAttributeDefinitions = 0;
        let helperSumDerivedAttributeDefinitions = 0;
        Workspace.EntityDefinition.forEach(ed => {
          if(ed.AttributeDefinition)
            helperSumAttributeDefinitions += ed.AttributeDefinition.length;
          if(ed.DerivedAttributeDefinition)
            helperSumDerivedAttributeDefinitions += ed.DerivedAttributeDefinition.length;
        });
        result.entityDefinitions.nr = Workspace.EntityDefinition.length;
        result.entityDefinitions.avgNrAttributeDefinitions = helperSumAttributeDefinitions/Workspace.EntityDefinition.length;
        result.entityDefinitions.avgNrDerivedAttributeDefinitions = helperSumDerivedAttributeDefinitions/Workspace.EntityDefinition.length;

        
        let helperSumHumanTaskDefinitions = 0;
        let helperSumDualTaskDefinitions = 0;
        CaseDefinition.StageDefinition.forEach(sd => {
          if(sd.HumanTaskDefinition)
            helperSumHumanTaskDefinitions += sd.HumanTaskDefinition.length;
          if(sd.DualTaskDefinition)
            helperSumDualTaskDefinitions += sd.DualTaskDefinition.length;
        });
        result.stageDefinitions.nr = CaseDefinition.StageDefinition.length;
        result.stageDefinitions.avgNrHumanTaskDefinitions = helperSumHumanTaskDefinitions/CaseDefinition.StageDefinition.length;
        result.stageDefinitions.avgNrDualTaskDefinitions = helperSumDualTaskDefinitions/CaseDefinition.StageDefinition.length;

        

      })
    }catch(e){
      console.log(e);
    }
    return Promise.resolve(result);
  }
}


