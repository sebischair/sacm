'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import xml2js from 'xml2js';
const fs = Promise.promisifyAll(require("fs"));
const xml2jspromise = Promise.promisifyAll(xml2js);

module.exports = class ModelAnalytics{



  static analyze(){    
    let result = {
      attributeDefinitions:{},
      entityDefinitions:{},
      stageDefinitions:{}
    };
    try{
      let filePath = 'app/importer/studyrelease.case.groningen.cs2.xml';
      xml2jspromise.parseStringAsync(fs.readFileSync(filePath).toString(), {explicitChildren:true, preserveChildrenOrder:true})
      .then(xml=>{
        let Workspace =  xml.SACMDefinition.Workspace[0];
        let CaseDefinition = Workspace.CaseDefinition[0];

        this.analyzeAttributeDefinitions(result, Workspace);
       
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


  static analyzeAttributeDefinitions(result, Workspace){
    result.attributeDefinitions = {
      nr:0,
      typeLink: 0,
      typeLinkUser: 0,
      typeLinkEntityDefinition: 0,
      typeNoType: 0,
      typeString: 0,
      typeLongText: 0,
      typeBoolean: 0,
      typeNumber: 0,
      typeEnumeration: 0,
      typeDate: 0,
      typeJson: 0,
      multiplicityAny: 0,
      multiplicityExactlyOne: 0,
      multiplicityMaximalOne: 0,
      multiplicityAtLeastOne: 0,
      defaultValues: 0,
      additionalDescription: 0,
      uiReference: 0,
      uiReferenceLineDiagram: 0,
      uiReferenceColors: 0,
      uiReferenceConditionalMultiplicity: 0,
      uiReferencePatientQuestionnaires: 0,
      uiReferenceLink: 0,
      uiReferencePrivateLink: 0
    } 

    //validTypes = ['link', 'notype', 'string', 'longtext', 'boolean', 'number', 'enumeration', 'date', 'json']

    Workspace.EntityDefinition.forEach(ed => {
      if(ed.AttributeDefinition)
        ed.AttributeDefinition.forEach(ad=>{
          result.attributeDefinitions.nr++;
         
          let type = ad.$.type.toLowerCase();
          if(type.startsWith('link')){
            result.attributeDefinitions.typeLink++;
            if(type.startsWith('link.user'))
              result.attributeDefinitions.typeLinkUser++;
            if(type.startsWith('link.entitydefinition'))
              result.attributeDefinitions.typeLinkEntityDefinition++;
          }
          if(type.startsWith('notype'))
            result.attributeDefinitions.typeNoType++;
          if(type.startsWith('string'))
            result.attributeDefinitions.typeString++;
          if(type.startsWith('longtext'))
            result.attributeDefinitions.typeLongText++;
          if(type.startsWith('boolean'))
            result.attributeDefinitions.typeBoolean++;
          if(type.startsWith('number'))
            result.attributeDefinitions.typeNumber++;
          if(type.startsWith('enumeration'))
            result.attributeDefinitions.typeEnumeration++;
          if(type.startsWith('date'))
            result.attributeDefinitions.typeDate++;
          if(type.startsWith('json'))
            result.attributeDefinitions.typeJson++;

          let multiplicity = ad.$.multiplicity;
          if(!multiplicity)
            multiplicity = 'any';
          multiplicity = multiplicity.toLowerCase();
          if(multiplicity == 'exactlyone'){
            result.attributeDefinitions.multiplicityExactlyOne++;
          }else if(multiplicity == 'maximalone'){
            result.attributeDefinitions.multiplicityMaximalOne++;
          }else if(multiplicity == 'atleastone'){
            result.attributeDefinitions.multiplicityAtLeastOne++;
          }else if(multiplicity == 'any'){
            result.attributeDefinitions.multiplicityAny++;
          }

          if(ad.$.defaultValues)
            result.attributeDefinitions.defaultValues++;
          if(ad.$.additionalDescription)
            result.attributeDefinitions.additionalDescription++;

          if(ad.$.uiReference){
            result.attributeDefinitions.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.attributeDefinitions.uiReferenceColors++;
            if(uiReference.startsWith('conditonalmultiplicity'))
              result.attributeDefinitions.uiReferenceConditionalMultiplicity++;
            if(uiReference.startsWith('patientquestionaires'))
              result.attributeDefinitions.uiReferencePatientQuestionnaires++;
            if(uiReference.startsWith('link'))
              result.attributeDefinitions.uiReferenceLink++;
            if(uiReference.startsWith('privatelink'))
              result.attributeDefinitions.uiReferencePrivateLink++;
            if(uiReference.startsWith('linediagram'))
              result.attributeDefinitions.uiReferenceLineDiagram++;
          }
            
        });
    });
    //result.attributeDefinitions.avgNrAttributeDefinitions = helperSumAttributeDefinitions/Workspace.EntityDefinition.length;
  }

}




