'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import find from 'find-promise';
import Excel from 'exceljs';
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
          authorName: c.author_name,
          authorEmail: c.author_email,
          files: []
        };
        for(let file of files){
          console.log('---analyze  ...'+file.replace(repositoryPath,'')) 
          commitResult.files.push({
            file: file.replace(repositoryPath,''),
            case: this.translatePathToCS(file),
            result: await this.analyzeFile(file)
          });
        }
        result.push(commitResult);
        if(i==2)
          break;
        
      }
      console.log('\nSet of all repository file names:');
      console.log(allFilePaths)

      await this.saveAsExcel(result);
    }catch(e){
      console.log(e);
    }    
    return result;
  }

  static async saveAsExcel(commits){
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('Analytics');
       
    worksheet.columns = [
      { key: 'commitHash', header: 'Hash', width:40},
      { key: 'commitDate', header: 'Date', width:25},
      { key: 'commitAuthorName', header: 'Author Name', width:5},
      { key: 'commitAuthorEmail', header: 'Author Email', width:5},
      { key: 'commitMessage', header: 'Message', width:10},
      { key: 'case', header: 'Case', width:6},
      { key: 'attributeDefinitionsNr', header: 'Nr', width:5},
      { key: 'attributeDefinitionsTypeLink', header: 'TypeLink', width:5},
      { key: 'attributeDefinitionsTypeLinkUser', header: 'TypeLinkUser', width:5},
      { key: 'attributeDefinitionsTypeLinkEntityDefinition', header: 'TypeLinkEntityDefinition', width:5},
      { key: 'attributeDefinitionsTypeNoType', header: 'TypeNoType', width:5},
      { key: 'attributeDefinitionsTypeString', header: 'TypeString', width:5},
      { key: 'attributeDefinitionsTypeLongText', header: 'TypeLongText', width:5},
      { key: 'attributeDefinitionsTypeBoolean', header: 'TypeBoolean', width:5},
      { key: 'attributeDefinitionsTypeNumber', header: 'TypeNumber', width:5},
      { key: 'attributeDefinitionsTypeNumberMin', header: 'TypeNumberMin', width:5},
      { key: 'attributeDefinitionsTypeNumberMax', header: 'TypeNumberMax', width:5},
      { key: 'attributeDefinitionsTypeEnumeration', header: 'TypeEnumeration', width:5},
      { key: 'attributeDefinitionsTypeEnumerationOptions', header: 'EnumerationOptions', width:5},
      { key: 'attributeDefinitionsTypeEnumerationOptionsAvg', header: 'EnumerationOptionsAvg', width:5},
      { key: 'attributeDefinitionsTypeDate', header: 'TypeDate', width:5},
      { key: 'attributeDefinitionsTypeDateBefore', header: 'TypeDateBefore', width:5},
      { key: 'attributeDefinitionsTypeDateAfter', header: 'TypeDateAfter', width:5},
      { key: 'attributeDefinitionsTypeJson', header: 'TypeJson', width:5},
      { key: 'attributeDefinitionsMultiplicityAny', header: 'MultiplicityAny', width:5},
      { key: 'attributeDefinitionsMultiplicityExactlyOne', header: 'MultiplicityExactlyOne', width:5},
      { key: 'attributeDefinitionsMultiplicityMaximalOne', header: 'MultiplicityMaximalOne', width:5},
      { key: 'attributeDefinitionsMultiplicityAtLeastOne', header: 'MultiplicityAtLeastOne', width:5},
      { key: 'attributeDefinitionsDefaultValues', header: 'DefaultValues', width:5},
      { key: 'attributeDefinitionsAdditionalDescription', header: 'AdditionalDescription', width:5},
      { key: 'attributeDefinitionsUiReference', header: 'UiReference', width:5},
      { key: 'attributeDefinitionsUiReferenceLineDiagram', header: 'UiReferenceLineDiagram', width:5},
      { key: 'attributeDefinitionsUiReferenceColors', header: 'UiReferenceColors', width:5},
      { key: 'attributeDefinitionsUiReferenceConditionalMultiplicity', header: 'UiReferenceConditionalMultiplicity', width:5},
      { key: 'attributeDefinitionsUiReferencePatientQuestionnaires', header: 'UiReferencePatientQuestionnaires', width:5},
      { key: 'attributeDefinitionsUiReferenceLink', header: 'UiReferenceLink', width:5},
      { key: 'attributeDefinitionsUiReferencePrivateLink', header: 'UiReferencePrivateLink', width:5},
      { key: 'attributeDefinitionsUiReferenceSvg', header: 'UiReferenceSvg', width:5},
    ]
    const fontTemplate = {
      color: { argb: 'FFFFFF' },
      size: 14,
      bold:true
    };
    const fontTemplate2 = {
      color: { argb: 'FFFFFF' }
    };
    const fillTemplate = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF5733'}
    }
    worksheet.getRow(2).values = worksheet.getRow(1).values;
    worksheet.getRow(1).values = [];
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Commit'
    worksheet.mergeCells('F1:AL1');
    worksheet.getCell('F1').value = 'AttributeDefinitions'
    worksheet.getRow(1).fill = fillTemplate;
    worksheet.getRow(1).font = fontTemplate;
    worksheet.getRow(2).fill = fillTemplate;
    worksheet.getRow(2).font = fontTemplate2;
    worksheet.getRow(2).alignment = { textRotation: 45 };
    worksheet.autoFilter = 'A2:AAA2';
    for(let commit of commits){
      for(let file of commit.files){

        let ad = null
        if(file.result && file.result.attributeDefinitions)
          ad = file.result.attributeDefinitions;

        worksheet.addRow({
          commitHash: commit.hash,
          commitDate: commit.date,
          commitAuthorName: commit.authorName,
          commitAuthorEmail: commit.authorEmail,
          commitMessage: commit.message,
          case: file.case,
          attributeDefinitionsNr: ad ? ad.nr : '',
          attributeDefinitionsTypeLink: ad ? ad.typeLink : '',
          attributeDefinitionsTypeLinkUser: ad ? ad.typeLinkUser : '',
          attributeDefinitionsTypeLinkEntityDefinition: ad ? ad.typeLinkEntityDefinition : '',
          attributeDefinitionsTypeNoType: ad ? ad.typeNoType : '',
          attributeDefinitionsTypeString: ad ? ad.typeString : '',
          attributeDefinitionsTypeLongText: ad ? ad.typeLongText : '',
          attributeDefinitionsTypeBoolean: ad ? ad.typeBoolean : '',
          attributeDefinitionsTypeNumber: ad ? ad.typeNumber : '',
          attributeDefinitionsTypeNumberMin: ad ? ad.typeNumberMin : '',
          attributeDefinitionsTypeNumberMax: ad ? ad.typeNumberMax : '',
          attributeDefinitionsTypeEnumeration: ad ? ad.typeEnumeration : '',
          attributeDefinitionsTypeEnumerationOptions: ad ? ad.typeEnumerationOptions : '',
          attributeDefinitionsTypeEnumerationOptionsAvg: ad ? ad.typeEnumerationOptionsAvg : '',
          attributeDefinitionsTypeDate: ad ? ad.typeDate : '',
          attributeDefinitionsTypeDateBefore: ad ? ad.typeDateBefore : '',
          attributeDefinitionsTypeDateAfter: ad ? ad.typeDateAfter : '',
          attributeDefinitionsTypeJson: ad ? ad.typeJson : '',
          attributeDefinitionsMultiplicityAny: ad ? ad.multiplicityAny : '',
          attributeDefinitionsMultiplicityExactlyOne: ad ? ad.multiplicityExactlyOne : '',
          attributeDefinitionsMultiplicityMaximalOne: ad ? ad.multiplicityMaximalOne : '',
          attributeDefinitionsMultiplicityAtLeastOne: ad ? ad.multiplicityAtLeastOne : '',
          attributeDefinitionsDefaultValues: ad ? ad.defaultValues : '',
          attributeDefinitionsAdditionalDescription: ad ? ad.additionalDescription : '',
          attributeDefinitionsUiReference: ad ? ad.uiReference : '',
          attributeDefinitionsUiReferenceLineDiagram: ad ? ad.uiReferenceLineDiagram : '',
          attributeDefinitionsUiReferenceColors: ad ? ad.uiReferenceColors : '',
          attributeDefinitionsUiReferenceConditionalMultiplicity: ad ? ad.uiReferenceConditionalMultiplicity : '',
          attributeDefinitionsUiReferencePatientQuestionnaires: ad ? ad.uiReferencePatientQuestionnaires : '',
          attributeDefinitionsUiReferenceLink: ad ? ad.uiReferenceLink : '',
          attributeDefinitionsUiReferencePrivateLink: ad ? ad.uiReferencePrivateLink : '',
          attributeDefinitionsUiReferenceSvg: ad ? ad.uiReferenceSvg : '',
        })
      }
      let to = worksheet.lastRow._number;
      let from = to - (commit.files.length-1);
      worksheet.mergeCells('A'+from+':A'+to);
      worksheet.mergeCells('B'+from+':B'+to);
      worksheet.mergeCells('C'+from+':C'+to);
      worksheet.mergeCells('D'+from+':D'+to);
      worksheet.mergeCells('E'+from+':E'+to);
      worksheet.getCell('A'+from).alignment = {vertical:'middle'};
      worksheet.getCell('B'+from).alignment = {vertical:'middle'};
      worksheet.getCell('C'+from).alignment = {vertical:'middle'};
      worksheet.getCell('D'+from).alignment = {vertical:'middle'};
      worksheet.getCell('E'+from).alignment = {vertical:'middle', wrapText: true};
    }

    await workbook.xlsx.writeFile(new Date().getTime()+'.xlsx');
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
              result.uiReferenceSvg++;
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




