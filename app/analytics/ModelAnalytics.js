'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import find from 'find-promise';
const fs = Promise.promisifyAll(require("fs"));
const xml2js = Promise.promisifyAll(require("xml2js"));
const repositoryPath = 'D:/Projekte/CONNECARE/Technical/repos/sacm.backend.analytics';
const Git = require('simple-git/promise')(repositoryPath);

module.exports = class ModelAnalytics{

  static translatePathToCS(filePath){
    let map = new Map();
    map.set('importer/studyrelease.case.barcelona.cs1.xml', 'BCS1');
    map.set('importer/studyrelease.case.barcelona.cs2.xml', 'BCS2');
    map.set('importer/studyrelease.case.groningen.cs1.xml', 'GCS1');
    map.set('importer/studyrelease.case.groningen.cs2.xml', 'GCS2');
    map.set('importer/studyrelease.case.israel.cs1.xml', 'ICS1');
    map.set('importer/studyrelease.case.israel.cs2.xml', 'ICS2');
    map.set('importer/studyrelease.case.leida.cs1.xml', 'LCS1');
    map.set('importer/studyrelease.case.leida.cs2.xml', 'LCS2');
    map.set('importer/studyrelease.case.isreal.cs1.xml', 'ICS1');
    map.set('importer/case.barcelona.cs1.xml', 'BCS1');
    map.set('importer/case.groningen.cs2.review.2.xml', 'GCS2');
    map.set('importer/case.groningen.cs2.review.xml', 'GCS2');
    map.set('importer/case.groningen.cs2.xml', 'GCS2');
    map.set('importer/case.israel.cs2.xml', 'ICS2');
    map.set('importer/case.leida.cs1.xml', 'ICS1');
    map.set('importer/case.leida.cs2.xml', 'LCS2');
    map.set('importer/cs1.barcelona.v1.xml', 'BCS1');
    map.set('importer/barcelona.cs3.xml', 'BCS2');
    map.set('importer/barcelona.cs3.xml', 'BCS2');

    for(let path of map.keys()){
      if(filePath.endsWith(path))
        return map.get(path);
    }
    return null;
  }

  static filterFiles(files){
    let matches = [];
    for(let file of files){
      file = file.replace(/\\/g,'/');
      if(this.translatePathToCS(file) != null)
        matches.push(file);
    }
    return matches;
  }

  static async analyzeRepository(){
    try{
      await Git.checkout(['master']);
      console.log('git checkout master completed')
      let data = await Git.log(['-m', '--follow', '*.xml']);
      console.log('git log completed - '+data.all.length + ' matching commits!')
      let allFilePaths = new Set();
      for(let i=0; i<data.all.length; i++){

        let c = data.all[i];
        await Git.checkout([c.hash]);
        console.log('\n'+(i+1)+'/'+data.all.length +' checkout '+c.hash+' completed! ');
        console.log('---'+c.message)
        let findPath = repositoryPath;
        if(await fs.exists(repositoryPath+'/app'))  
          findPath +='/app';
        let files = await find.file(/\.xml$/, findPath);
        
        console.log('---find completed!')
        if(files)
          for(let f of files)
            allFilePaths.add(f.replace(/\\/g,'/').replace(repositoryPath,''));

        files = this.filterFiles(files);
        console.log('---files after filter: '+files.length);
        
        for(let file of files){
          
        }
        //if(i==10)
          break;
      
      }
      console.log('\nSet of all repository file names:');
      console.log(allFilePaths)
    }catch(e){
      console.log(e);
    }
  }

  static async analyze(){    
   
    let result = {};
    try{
      const filePath = 'app/importer/studyrelease.case.groningen.cs2.xml';
      const fileContent = fs.readFileSync(filePath).toString();
      const xml = await xml2js.parseStringAsync(fileContent, {explicitChildren:true, preserveChildrenOrder:true});     
      const Workspace =  xml.SACMDefinition.Workspace[0];

      this.analyzeAttributeDefinitions(result, Workspace);
      this.analyzeDerivedAttributeDefinitions(result, Workspace);
      this.analyzeEntityDefinitions(result, Workspace);
      this.analyzeStageDefinitions(result, Workspace);
    }catch(e){
      console.log(e);
    }
    return result;
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
      typeNumberMin: 0,
      typeNumberMax: 0,
      typeEnumeration: 0,
      typeEnumerationOptions: 0,
      typeEnumerationOptionsAvg: 0,
      typeDate: 0,
      typeDateBefore: 0,
      typeDateAfter: 0,
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
      uiReferencePrivateLink: 0,
      uiReferenceSvg: 0
    } 

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
          }else if(type.startsWith('notype')){
            result.attributeDefinitions.typeNoType++;
          }else if(type.startsWith('string')){
            result.attributeDefinitions.typeString++;
          }else if(type.startsWith('longtext')){
            result.attributeDefinitions.typeLongText++;
          }else if(type.startsWith('boolean')){
            result.attributeDefinitions.typeBoolean++;
          }else if(type.startsWith('number')){
            result.attributeDefinitions.typeNumber++;
            if(type.indexOf('min') != -1)
              result.attributeDefinitions.typeNumberMin++;
            if(type.indexOf('max') != -1)
              result.attributeDefinitions.typeNumberMax++;
          }else if(type.startsWith('enumeration')){
            result.attributeDefinitions.typeEnumeration++;
            if(ad.EnumerationOption)
              result.attributeDefinitions.typeEnumerationOptions += ad.EnumerationOption.length;
          }else if(type.startsWith('date')){
            result.attributeDefinitions.typeDate++;
            if(type.indexOf('before') != -1)
              result.attributeDefinitions.typeDateBefore++;
            if(type.indexOf('after') != -1)
              result.attributeDefinitions.typeDateAfter++;
          }else if(type.startsWith('json')){
            result.attributeDefinitions.typeJson++;
          }

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
            if(uiReference.startsWith('svg'))
              result.attributeDefinitions.uiReferenceLineSvg++;
          }
            
        });
    });
    if(result.attributeDefinitions.typeEnumeration != 0)
      result.attributeDefinitions.typeEnumerationOptionsAvg = result.attributeDefinitions.typeEnumerationOptions/result.attributeDefinitions.typeEnumeration;
  }

  static analyzeDerivedAttributeDefinitions(result, Workspace){
    result.derivedAttributeDefinitions = {
      nr:0,
      explicitType: 0,            
      additionalDescription: 0,
      uiReference: 0,
      uiReferenceLineDiagram: 0,
      uiReferenceColors: 0,
      uiReferenceSvg: 0
    } 

    Workspace.EntityDefinition.forEach(ed => {
      if(ed.DerivedAttributeDefinition)
        ed.DerivedAttributeDefinition.forEach(ad=>{
          result.derivedAttributeDefinitions.nr++;

          if(ad.$.explicitAttributeType)
            result.derivedAttributeDefinitions.explicitType++;
          if(ad.$.additionalDescription)
            result.derivedAttributeDefinitions.additionalDescription++;

          if(ad.$.uiReference){
            result.derivedAttributeDefinitions.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.derivedAttributeDefinitions.uiReferenceColors++;
            if(uiReference.startsWith('linediagram'))
              result.derivedAttributeDefinitions.uiReferenceLineDiagram++;
            if(uiReference.startsWith('svg'))
              result.derivedAttributeDefinitions.uiReferenceLineSvg++;
          }
            
        });
    });
  }

  static analyzeEntityDefinitions(result, Workspace){
    result.entityDefinitions = {
      nr:0,
      avgNrAttributeDefinitions: 0,
      avgNrDerivedAttributeDefinitions: 0
    }     

    let helperSumAttributeDefinitions = 0;
    let helperSumDerivedAttributeDefinitions = 0;
    Workspace.EntityDefinition.forEach(ed => {
      result.entityDefinitions.nr++;
      if(ed.AttributeDefinition)
        helperSumAttributeDefinitions += ed.AttributeDefinition.length;
      if(ed.DerivedAttributeDefinition)
        helperSumDerivedAttributeDefinitions += ed.DerivedAttributeDefinition.length;
    });
    result.entityDefinitions.avgNrAttributeDefinitions = helperSumAttributeDefinitions/Workspace.EntityDefinition.length;
    result.entityDefinitions.avgNrDerivedAttributeDefinitions = helperSumDerivedAttributeDefinitions/Workspace.EntityDefinition.length;
  }

  static analyzeStageDefinitions(result, Workspace){
    result.stageDefinitions = {
      nr: 0,
      avgNrHumanTaskDefinitions: 0,
      avgNrAutomatedTaskDefinitions: 0,
      avgNrDualTaskDefinitions: 0
    }
    let helperSumHumanTaskDefinitions = 0;
    let helperSumAutomatedTaskDefinitions = 0;
    let helperSumDualTaskDefinitions = 0;

    let CaseDefinition = Workspace.CaseDefinition[0];

    CaseDefinition.StageDefinition.forEach(sd => {
      result.stageDefinitions.nr++;
      if(sd.HumanTaskDefinition)
        helperSumHumanTaskDefinitions += sd.HumanTaskDefinition.length;
      if(sd.AutomatedTaskDefinition)
        helperSumAutomatedTaskDefinitions += sd.AutomatedTaskDefinition.length;
      if(sd.DualTaskDefinition)
        helperSumDualTaskDefinitions += sd.DualTaskDefinition.length;
    });
    result.stageDefinitions.avgNrHumanTaskDefinitions = helperSumHumanTaskDefinitions/CaseDefinition.StageDefinition.length;
    result.stageDefinitions.avgNrAutomatedTaskDefinitions = helperSumAutomatedTaskDefinitions/CaseDefinition.StageDefinition.length;
    result.stageDefinitions.avgNrDualTaskDefinitions = helperSumDualTaskDefinitions/CaseDefinition.StageDefinition.length;
  }

}




