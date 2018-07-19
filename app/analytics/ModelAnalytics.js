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
    let result = [];
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
        console.log('---Message: '+c.message)
        console.log('---Date: '+c.date)
        let findPath = repositoryPath;
        if(await fs.exists(repositoryPath+'/app'))  
          findPath +='/app';
        let files = await find.file(/\.xml$/, findPath);
        
        if(files)
          for(let f of files)
            allFilePaths.add(f.replace(/\\/g,'/').replace(repositoryPath,''));

        files = this.filterFiles(files);
        console.log('---found '+files.length+' files!');
        console.log(c);
        let commitResult = {
          hash: c.hash,
          date: c.date,
          message: c.message,
          author_name: c.author_name,
          author_email: c.author_email,
          files: []
        };
        for(let file of files){
          console.log('---analyze  ...'+file.replace(repositoryPath,'')) 
          commitResult.files.push({
            file: file.replace(repositoryPath,''),
            case: this.translatePathToCS(file),
            result: await this.analyzeFile(file)
          });
          console.log(commitResult)
          break;
        }
        result.push(commitResult);
        //if(i==10)
          break;
        
      }
      console.log('\nSet of all repository file names:');
      console.log(allFilePaths)
    }catch(e){
      console.log(e);
    }
    return result;
  }

  static async analyzeFile(filePath){   
    let result = {};
    try{
      //const filePath = 'app/importer/studyrelease.case.groningen.cs2.xml';
      const fileContent = fs.readFileSync(filePath).toString();
      const xml = await xml2js.parseStringAsync(fileContent, {explicitChildren:true, preserveChildrenOrder:true});     
      const Workspace =  xml.SACMDefinition.Workspace[0];

      result.attributeDefinitions = this.analyzeAttributeDefinitions(Workspace);      
      result.derivedAttributeDefinitions = this.analyzeDerivedAttributeDefinitions(Workspace);
      result.entityDefinitions = this.analyzeEntityDefinitions(Workspace);
      result.stageDefinitions = this.analyzeStageDefinitions(Workspace);
    }catch(e){
      console.log(e);
    }
    return result;
  }


  static analyzeAttributeDefinitions(Workspace){
    let result = {
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
          result.nr++;
         
          let type = ad.$.type.toLowerCase();
          if(type.startsWith('link')){
            result.typeLink++;
            if(type.startsWith('link.user'))
              result.typeLinkUser++;
            if(type.startsWith('link.entitydefinition'))
              result.typeLinkEntityDefinition++;
          }else if(type.startsWith('notype')){
            result.typeNoType++;
          }else if(type.startsWith('string')){
            result.typeString++;
          }else if(type.startsWith('longtext')){
            result.typeLongText++;
          }else if(type.startsWith('boolean')){
            result.typeBoolean++;
          }else if(type.startsWith('number')){
            result.typeNumber++;
            if(type.indexOf('min') != -1)
              result.typeNumberMin++;
            if(type.indexOf('max') != -1)
              result.typeNumberMax++;
          }else if(type.startsWith('enumeration')){
            result.typeEnumeration++;
            if(ad.EnumerationOption)
              result.typeEnumerationOptions += ad.EnumerationOption.length;
          }else if(type.startsWith('date')){
            result.typeDate++;
            if(type.indexOf('before') != -1)
              result.typeDateBefore++;
            if(type.indexOf('after') != -1)
              result.typeDateAfter++;
          }else if(type.startsWith('json')){
            result.typeJson++;
          }

          let multiplicity = ad.$.multiplicity;
          if(!multiplicity)
            multiplicity = 'any';
          multiplicity = multiplicity.toLowerCase();
          if(multiplicity == 'exactlyone'){
            result.multiplicityExactlyOne++;
          }else if(multiplicity == 'maximalone'){
            result.multiplicityMaximalOne++;
          }else if(multiplicity == 'atleastone'){
            result.multiplicityAtLeastOne++;
          }else if(multiplicity == 'any'){
            result.multiplicityAny++;
          }

          if(ad.$.defaultValues)
            result.defaultValues++;
          if(ad.$.additionalDescription)
            result.additionalDescription++;

          if(ad.$.uiReference){
            result.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.uiReferenceColors++;
            if(uiReference.startsWith('conditonalmultiplicity'))
              result.uiReferenceConditionalMultiplicity++;
            if(uiReference.startsWith('patientquestionaires'))
              result.uiReferencePatientQuestionnaires++;
            if(uiReference.startsWith('link'))
              result.uiReferenceLink++;
            if(uiReference.startsWith('privatelink'))
              result.uiReferencePrivateLink++;
            if(uiReference.startsWith('linediagram'))
              result.uiReferenceLineDiagram++;
            if(uiReference.startsWith('svg'))
              result.uiReferenceLineSvg++;
          }
            
        });
    });
    if(result.typeEnumeration != 0)
      result.typeEnumerationOptionsAvg = result.typeEnumerationOptions/result.typeEnumeration;
    return result;
  }

  static analyzeDerivedAttributeDefinitions(Workspace){
    let result = {
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
          result.nr++;

          if(ad.$.explicitAttributeType)
            result.explicitType++;
          if(ad.$.additionalDescription)
            result.additionalDescription++;

          if(ad.$.uiReference){
            result.uiReference++;
            let uiReference = ad.$.uiReference.toLowerCase();
            if(uiReference.startsWith('colors'))
              result.uiReferenceColors++;
            if(uiReference.startsWith('linediagram'))
              result.uiReferenceLineDiagram++;
            if(uiReference.startsWith('svg'))
              result.uiReferenceLineSvg++;
          }
            
        });
    });
    return result;
  }

  static analyzeEntityDefinitions(Workspace){
    let result = {
      nr:0,
      avgNrAttributeDefinitions: 0,
      avgNrDerivedAttributeDefinitions: 0
    }     

    let helperSumAttributeDefinitions = 0;
    let helperSumDerivedAttributeDefinitions = 0;
    Workspace.EntityDefinition.forEach(ed => {
      result.nr++;
      if(ed.AttributeDefinition)
        helperSumAttributeDefinitions += ed.AttributeDefinition.length;
      if(ed.DerivedAttributeDefinition)
        helperSumDerivedAttributeDefinitions += ed.DerivedAttributeDefinition.length;
    });
    result.avgNrAttributeDefinitions = helperSumAttributeDefinitions/Workspace.EntityDefinition.length;
    result.avgNrDerivedAttributeDefinitions = helperSumDerivedAttributeDefinitions/Workspace.EntityDefinition.length;

    return result;
  }

  static analyzeStageDefinitions(Workspace){
    let result = {
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
      result.nr++;
      if(sd.HumanTaskDefinition)
        helperSumHumanTaskDefinitions += sd.HumanTaskDefinition.length;
      if(sd.AutomatedTaskDefinition)
        helperSumAutomatedTaskDefinitions += sd.AutomatedTaskDefinition.length;
      if(sd.DualTaskDefinition)
        helperSumDualTaskDefinitions += sd.DualTaskDefinition.length;
    });
    result.avgNrHumanTaskDefinitions = helperSumHumanTaskDefinitions/CaseDefinition.StageDefinition.length;
    result.avgNrAutomatedTaskDefinitions = helperSumAutomatedTaskDefinitions/CaseDefinition.StageDefinition.length;
    result.avgNrDualTaskDefinitions = helperSumDualTaskDefinitions/CaseDefinition.StageDefinition.length;

    return result;
  }

}




