'use strict';
import Promise from 'bluebird';
import winston from 'winston';
import Excel from 'exceljs';
import sizeof from 'object-sizeof';
import fs from 'fs-extra';
import ModelAnalytics from './ModelAnalytics';
const {gzip, ungzip} = require('node-gzip');

module.exports = class ExcelModelAnalytics extends ModelAnalytics{

  
  constructor() {
    super();
    this.workbook = new Excel.Workbook();
  }

  async postAnalytics(){

    let commits = await this.readJSON('modelanalytics1532556405202.plain.json.gz');
    console.log('Nr commits to process: '+commits.length);
    
    commits = commits.reverse();
    //this.addTab(commits, 'All')

    let cases = new Set(this.constructor.translationMap().values()); 
    cases = [];
    cases.forEach(c => {
      console.log('Analyzing case '+c);
      let filteredCommits = [];
      let lastFiles = null;
      commits.forEach(commit=>{
        let filteredCommit = JSON.parse(JSON.stringify(commit));
        filteredCommit.files = [];
        commit.files.forEach(file=>{
          if(file.case == c)
            filteredCommit.files.push(file);
        })
        if(filteredCommit.files.length > 0 && JSON.stringify(filteredCommit.files) != lastFiles){
          filteredCommits.push(filteredCommit);
          lastFiles = JSON.stringify(filteredCommit.files);
        }
      });
      this.addTab(filteredCommits, c);      
    });

    this.addOverviewTab(commits);

    await this.writeFile('test');
  } 


  async readJSON(filename){
    try{
      console.log('read JSON');
      return JSON.parse((await ungzip(await fs.readFile(filename))).toString());
    }catch(e){
      console.log(e)
    }
  }

  addOverviewTab(commits){
    const lastCommit = commits[commits.length-1];
    let columns = [
      {key:'KPI', header:'KPI', width:40}
    ];    
    lastCommit.files.forEach(file=>{
      columns.push({key:file.case, header:file.case, width:7})
    });
    let rows = [];
    let objNrAttributeDefinitions = {KPI:'# AttributeDefinitions'};
    let objNrDerivedAttributeDefinitions = {KPI:'# DerivedAttributeDefinitions'};
    let objNrEntityDefinitions = {KPI:'# EntityDefinitions'};
    let objNrSummarySectionDefinitions = {KPI:'# SummarySectionDefinitions'};
    let objNrStageDefinitions = {KPI:'# StageDefinitions'};
    let objNrHumanTaskDefinitions = {KPI:'# HumanTaskDefinitions'};
    let objNrDualTaskDefinitions = {KPI:'# DualTaskDefinitions'};
    let objNrAutomatedTaskDefinitions = {KPI:'# AutomatedTaskDefinitions'};
    let objNrSentryDefinitions = {KPI:'# SentryDefinitions'};
    let objNrHttpHookDefinitions = {KPI:'# HttpHookDefinitions'};
    let objNrActions = {KPI:'# Actions'};
    
    lastCommit.files.forEach(file=>{
      objNrAttributeDefinitions[file.case] = file.result.attributeDefinitions.nr;  
      objNrDerivedAttributeDefinitions[file.case] = file.result.derivedAttributeDefinitions.nr;  
      objNrEntityDefinitions[file.case] = file.result.entityDefinitions.nr;    
      objNrSummarySectionDefinitions[file.case] = file.result.summarySectionDefinitions.nr;  
      objNrStageDefinitions[file.case] = file.result.stageDefinitions.nr;  
      objNrHumanTaskDefinitions[file.case] = file.result.humanTaskDefinitions.nr; 
      objNrDualTaskDefinitions[file.case] = file.result.dualTaskDefinitions.nr;  
      objNrAutomatedTaskDefinitions[file.case] = file.result.automatedTaskDefinitions.nr;  
      objNrSentryDefinitions[file.case] = file.result.sentryDefinitions.nr;  
      objNrHttpHookDefinitions[file.case] = file.result.httpHookDefinitions.nr;  
      objNrActions[file.case] = file.result.actions.nr;     
    });
    rows.push(objNrAttributeDefinitions);
    rows.push(objNrDerivedAttributeDefinitions);
    rows.push(objNrEntityDefinitions);
    rows.push(objNrSummarySectionDefinitions);
    rows.push(objNrStageDefinitions);
    rows.push(objNrHumanTaskDefinitions);
    rows.push(objNrDualTaskDefinitions);
    rows.push(objNrAutomatedTaskDefinitions);
    rows.push(objNrSentryDefinitions);
    rows.push(objNrHttpHookDefinitions);
    rows.push(objNrActions);
    this.addCustomTab('overview', rows, columns);
  }

  addCustomTab(tabName, rows, columns){
    var worksheet = this.workbook.addWorksheet(tabName);
    worksheet.columns = columns;
    rows.forEach(row=>{
      worksheet.addRow(row); 
    });
  }

  addTab(commits, tabName){    
    console.log('add Tab '+tabName);
    var worksheet = this.workbook.addWorksheet(tabName);
       
    const columns = [
      { key: 'commitHash', header: 'Hash', width:40, group: 'Commit'},
      { key: 'commitDate', header: 'Date', width:25},
      { key: 'commitAuthorName', header: 'Author Name', width:5},
      { key: 'commitAuthorEmail', header: 'Author Email', width:5},
      { key: 'commitMessage', header: 'Message', width:10},
      { key: 'case', header: 'Case', width:6},
      { key: 'attributeDefinitionsNr', header: 'Nr', width:5, group: 'AttributeDefinitions'},
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
      { key: 'derivedAttributeDefinitionsNr', header: 'Nr', width:5, group: 'DerivedAttributeDefinitions'},
      { key: 'derivedAttributeDefinitionsExplicitType', header: 'ExplicitType', width:5},
      { key: 'derivedAttributeDefinitionsAdditionalDescription', header: 'AdditionalDescription', width:5},
      { key: 'derivedAttributeDefinitionsUiReference', header: 'UiReference', width:5},
      { key: 'derivedAttributeDefinitionsUiReferenceLineDiagram', header: 'UiReferenceLineDiagram', width:5},
      { key: 'derivedAttributeDefinitionsUiReferenceColors', header: 'UiReferenceColors', width:5},
      { key: 'derivedAttributeDefinitionsUiReferenceSvg', header: 'UiReferenceSvg', width:5},
      { key: 'entityDefinitionsNr', header: 'Nr', width:5, group: 'EntityDefinitions'},
      { key: 'entityDefinitionsAvgNrAttributeDefinitions', header: 'AvgNrAttributeDefinitions', width:5},
      { key: 'entityDefinitionsAvgNrDerivedAttributeDefinitions', header: 'AvgNrDerivedAttributeDefinitions', width:5},
      { key: 'caseDefinitionHasClientPath', header: 'HasClientPath', width:8, group: 'CaseDefinition'},
      { key: 'caseDefinitionHasOwnerPath', header: 'hasOwnerPath', width:8},
      { key: 'caseDefinitionHasNewEntityDefinitionId', header: 'HasNewEntityDefinitionId', width:8},
      { key: 'caseDefinitionHasNewEntityAttachPath', header: 'HasNewEntityAttachPath', width:8},
      { key: 'caseDefinitionHasNotesDefaultValue', header: 'HasNotesDefaultValue', width:8},
      { key: 'caseDefinitionHasOnAvailableHTTPHookURL', header: 'HasOnAvailableHTTPHookURL', width:8},
      { key: 'caseDefinitionHasOnEnableHttpHTTPHookURL', header: 'HasOnEnableHttpHTTPHookURL', width:8},
      { key: 'caseDefinitionHasOnActivateHTTPHookURL', header: 'HasOnActivateHTTPHookURL', width:8},
      { key: 'caseDefinitionHasOnCompleteHTTPHookURL', header: 'HasOnCompleteHTTPHookURL', width:8},
      { key: 'caseDefinitionHasOnTerminateHTTPHookURL', header: 'HasOnTerminateHTTPHookURL', width:8},
      { key: 'caseDefinitionHasOnDeleteHTTPHookURL', header: 'HasOnDeleteHTTPHookURL', width:8},
      { key: 'summarySectionDefinitionsNr', header: 'Nr', width:5, group: 'SummarySectionDefinitions'},
      { key: 'summarySectionDefinitionsAvgNrSummaryParamDefinitions', header: 'AvgNrSummaryParamDefinitions', width:5},
      { key: 'summarySectionDefinitionsPositionLeft', header: 'PositionLeft', width:5},
      { key: 'summarySectionDefinitionsPositionCenter', header: 'PositionCenter', width:5},
      { key: 'summarySectionDefinitionsPositionRight', header: 'PositionRight', width:5},
      { key: 'summarySectionDefinitionsPositionStretched', header: 'PositionStretched', width:5},
      { key: 'stageDefinitionsNr', header: 'Nr', width: 5, group: 'StageDefinitions'},
      { key: 'stageDefinitionsOwnerPath', header: 'OwnerPath', width: 5 },
      { key: 'stageDefinitionsRepeatableOnce', header: 'RepeatableOnce', width: 5 },
      { key: 'stageDefinitionsRepeatableSerial', header: 'RepeatableSerial',  width: 5 },
      { key: 'stageDefinitionsRepeatableParallel', header: 'RepeatableParallel', width: 5 },
      { key: 'stageDefinitionsIsMandatory', header: 'IsMandatory', width: 5 },
      { key: 'stageDefinitionsActivationAutomatic', header: 'ActivationAutomatic', width: 5 },
      { key: 'stageDefinitionsActivationManual', header: 'ActivationManual', width: 5 },
      { key: 'stageDefinitionsActivationExpression', header: 'ActivationExpression', width: 5 },
      { key: 'stageDefinitionsManualActivationExpression', header: 'ManualActivationExpression', width: 5 },
      { key: 'stageDefinitionsNewEntityDefinition', header: 'NewEntityDefinition', width: 5 },
      { key: 'stageDefinitionsNewEntityAttachPath', header: 'NewEntityAttachPath', width: 5 },
      { key: 'stageDefinitionsExternalId', header: 'ExternalId', width: 5 },
      { key: 'stageDefinitionsDynamicDescriptionPath', header: 'DynamicDescriptionPath', width: 5 },
      { key: 'stageDefinitionsAvgNrHumanTaskDefinitions', header: 'AvgNrHumanTaskDefinitions', width: 5 },
      { key: 'stageDefinitionsAvgNrAutomatedTaskDefinitions', header: 'AvgNrAutomatedTaskDefinitions', width: 5 },
      { key: 'stageDefinitionsAvgNrDualTaskDefinitions', header: 'AvgNrDualTaskDefinitions', width: 5 },
      { key: 'stageDefinitionsAvgNrSentryDefinitions', header: 'AvgNrSentryDefinitions', width: 5 },
      { key: 'stageDefinitionsAvgNrHttpHookDefinitions', header: 'AvgNrHttpHookDefinitions', width: 5 },
      { key: 'humanTaskDefinitionsNr', header: 'Nr', width: 5, group:'HumanTaskDefinitions'},
      { key: 'humanTaskDefinitionsOwnerPath', header: 'OwnerPath', width: 5 },
      { key: 'humanTaskDefinitionsRepeatableOnce', header: 'RepeatableOnce', width: 5 },
      { key: 'humanTaskDefinitionsRepeatableSerial', header: 'RepeatableSerial', width: 5 },
      { key: 'humanTaskDefinitionsRepeatableParallel', header: 'RepeatableParallel', width: 5 },
      { key: 'humanTaskDefinitionsIsMandatory', header: 'IsMandatory', width: 5 },
      { key: 'humanTaskDefinitionsActivationAutomatic', header: 'ActivationAutomatic', width: 5 },
      { key: 'humanTaskDefinitionsActivationManual', header: 'ActivationManual', width: 5 },
      { key: 'humanTaskDefinitionsActivationExpression', header: 'ActivationExpression', width: 5 },
      { key: 'humanTaskDefinitionsManualActivationExpression', header: 'ManualActivationExpression', width: 5 },
      { key: 'humanTaskDefinitionsNewEntityDefinition', header: 'NewEntityDefinition', width: 5 },
      { key: 'humanTaskDefinitionsNewEntityAttachPath', header: 'NewEntityAttachPath', width: 5 },
      { key: 'humanTaskDefinitionsExternalId', header: 'ExternalId', width: 5 },
      { key: 'humanTaskDefinitionsDynamicDescriptionPath', header: 'DynamicDescriptionPath', width: 5 },
      { key: 'humanTaskDefinitionsFootnote', header: 'Footnote', width: 5 },
      { key: 'humanTaskDefinitionsAvgNrTaskParamDefinitions', header: 'AvgNrTaskParamDefinitions', width: 5 },
      { key: 'humanTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory', header: 'AvgNrTaskParamDefinitionsIsMandatory', width: 5 },
      { key: 'humanTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly', header: 'AvgNrTaskParamDefinitionsIsReadOnly', width: 5 },
      { key: 'humanTaskDefinitionsAvgNrSentryDefinitions', header: 'AvgNrSentryDefinitions', width: 5 },
      { key: 'humanTaskDefinitionsAvgNrHttpHookDefinitions', header: 'AvgNrHttpHookDefinitions', width: 5 },
      { key: 'humanTaskDefinitionsDueDatePath', header: 'DueDatePath', width: 5 },
      { key: 'automatedTaskDefinitionsNr', header: 'Nr', width: 5 },
      { key: 'automatedTaskDefinitionsOwnerPath', header: 'OwnerPath', width: 5, group: 'AutomatedTaskDefinitions' },
      { key: 'automatedTaskDefinitionsRepeatableOnce', header: 'RepeatableOnce', width: 5 },
      { key: 'automatedTaskDefinitionsRepeatableSerial', header: 'RepeatableSerial', width: 5 },
      { key: 'automatedTaskDefinitionsRepeatableParallel', header: 'RepeatableParallel', width: 5 },
      { key: 'automatedTaskDefinitionsIsMandatory', header: 'IsMandatory', width: 5 },
      { key: 'automatedTaskDefinitionsActivationAutomatic', header: 'ActivationAutomatic', width: 5 },
      { key: 'automatedTaskDefinitionsActivationManual', header: 'ActivationManual', width: 5 },
      { key: 'automatedTaskDefinitionsActivationExpression', header: 'ActivationExpression', width: 5 },
      { key: 'automatedTaskDefinitionsManualActivationExpression', header: 'ManualActivationExpression', width: 5 },
      { key: 'automatedTaskDefinitionsNewEntityDefinition', header: 'NewEntityDefinition', width: 5 },
      { key: 'automatedTaskDefinitionsNewEntityAttachPath', header: 'NewEntityAttachPath', width: 5 },
      { key: 'automatedTaskDefinitionsExternalId', header: 'ExternalId', width: 5 },
      { key: 'automatedTaskDefinitionsDynamicDescriptionPath', header: 'DynamicDescriptionPath', width: 5 },
      { key: 'automatedTaskDefinitionsFootnote', header: 'Footnote', width: 5 },
      { key: 'automatedTaskDefinitionsAvgNrTaskParamDefinitions', header: 'AvgNrTaskParamDefinitions', width: 5 },
      { key: 'automatedTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory', header: 'AvgNrTaskParamDefinitionsIsMandatory', width: 5 },
      { key: 'automatedTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly', header: 'AvgNrTaskParamDefinitionsIsReadOnly', width: 5 },
      { key: 'automatedTaskDefinitionsAvgNrSentryDefinitions', header: 'AvgNrSentryDefinitions', width: 5 },
      { key: 'automatedTaskDefinitionsAvgNrHttpHookDefinitions', header: 'AvgNrHttpHookDefinitions', width: 5 },
      { key: 'automatedTaskDefinitionsAutomaticCompleteOnPath', header: 'AutomaticCompleteOnPath', width: 5 },
      { key: 'dualTaskDefinitionsNr', header: 'Nr', width: 5, group: 'DualTaskDefinitions'},
      { key: 'dualTaskDefinitionsOwnerPath', header: 'OwnerPath', width: 5 },
      { key: 'dualTaskDefinitionsRepeatableOnce', header: 'RepeatableOnce', width: 5 },
      { key: 'dualTaskDefinitionsRepeatableSerial', header: 'RepeatableSerial', width: 5 },
      { key: 'dualTaskDefinitionsRepeatableParallel', header: 'RepeatableParallel', width: 5 },
      { key: 'dualTaskDefinitionsIsMandatory', header: 'IsMandatory', width: 5 },
      { key: 'dualTaskDefinitionsActivationAutomatic', header: 'ActivationAutomatic', width: 5 },
      { key: 'dualTaskDefinitionsActivationManual', header: 'ActivationManual', width: 5 },
      { key: 'dualTaskDefinitionsActivationExpression', header: 'ActivationExpression', width: 5 },
      { key: 'dualTaskDefinitionsManualActivationExpression', header: 'ManualActivationExpression', width: 5 },
      { key: 'dualTaskDefinitionsNewEntityDefinition', header: 'NewEntityDefinition', width: 5 },
      { key: 'dualTaskDefinitionsNewEntityAttachPath', header: 'NewEntityAttachPath', width: 5 },
      { key: 'dualTaskDefinitionsExternalId', header: 'ExternalId', width: 5 },
      { key: 'dualTaskDefinitionsDynamicDescriptionPath', header: 'DynamicDescriptionPath', width: 5 },
      { key: 'dualTaskDefinitionsFootnote', header: 'Footnote', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrTaskParamDefinitions', header: 'AvgNrTaskParamDefinitions', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory', header: 'AvgNrTaskParamDefinitionsIsMandatory', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly', header: 'AvgNrTaskParamDefinitionsIsReadOnly', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrSentryDefinitions', header: 'AvgNrSentryDefinitions', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrHttpHookDefinitions', header: 'AvgNrHttpHookDefinitions', width: 5 },
      { key: 'dualTaskDefinitionsDueDatePath', header: 'DueDatePath', width: 5 },
      { key: 'dualTaskDefinitionsAutomaticCompleteOnPath', header: 'AutomaticCompleteOnPath', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrTaskParamDefinitionsHumanPart', header: 'AvgNrTaskParamDefinitionsHumanPart', width: 5 },
      { key: 'dualTaskDefinitionsAvgNrTaskParamDefinitionsAutomatedPart', header: 'AvgNrTaskParamDefinitionsAutomatedPart', width: 5 },
      { key: 'sentryDefinitionsNr', header: 'Nr', width: 5, group: 'SentryDefinitions' },
      { key: 'sentryDefinitionsAvgNrPreconditions', header: 'AvgNrPreconditions', width: 5 },
      { key: 'sentryDefinitionsAvgNrExpressionsPerPrecondition', header: 'AvgNrExpressionsPerPrecondition', width: 5 },
      { key: 'httpHookDefinitionsNr', header: 'Nr', width: 5, group: 'HttpHookDefinitions'},
      { key: 'httpHookDefinitionsMethodGET', header: 'MethodGET', width: 5},
      { key: 'httpHookDefinitionsMethodPOST', header: 'MethodPOST', width: 5 },
      { key: 'httpHookDefinitionsMethodPUT', header: 'MethodPUT', width: 5 },
      { key: 'httpHookDefinitionsMethodDEL', header: 'MethodDEL', width: 5 },
      { key: 'httpHookDefinitionsFailureMessage', header: 'FailureMessage', width: 5 },
      { key: 'httpHookDefinitionsOnAvailable', header: 'OnAvailable', width: 5 },
      { key: 'httpHookDefinitionsOnEnable', header: 'OnEnable', width: 5 },
      { key: 'httpHookDefinitionsOnActivate', header: 'OnActivate', width: 5 },
      { key: 'httpHookDefinitionsOnComplete', header: 'OnComplete', width: 5 },
      { key: 'httpHookDefinitionsOnTerminate', header: 'OnTerminate', width: 5 },
      { key: 'httpHookDefinitionsOnActivateHumanPart', header: 'OnActivateHumanPart', width: 5 },
      { key: 'httpHookDefinitionsOnCompleteHumanPart', header: 'OnCompleteHumanPart', width: 5 },
      { key: 'httpHookDefinitionsOnActivateAutomatedPart', header: 'OnActivateAutomatedPart', width: 5 },
      { key: 'httpHookDefinitionsOnCompleteAutomatedPart', header: 'OnCompleteAutomatedPart', width: 5 },
      { key: 'actionsNr', header: 'Nr', width: 5, group: 'Actions' },
      { key: 'actionsActivateStage', header: 'ActivateStage', width: 5 },
      { key: 'actionsCompleteStage', header: 'CompleteStage', width: 5 },
      { key: 'actionsActivateHumanTask', header: 'ActivateHumanTask', width: 5 },
      { key: 'actionsActivateDualTask', header: 'ActivateDualTask', width: 5 },
      { key: 'actionsCompleteHumanTask', header: 'CompleteHumanTask', width: 5 },
      { key: 'actionsCompleteAutomatedTask', header: 'CompleteAutomatedTask', width: 5 },
      { key: 'actionsCompleteDualTaskHumanPart', header: 'CompleteDualTaskHumanPart', width: 5 },
      { key: 'actionsCompleteDualTaskAutomatedPart', header: 'CompleteDualTaskAutomatedPart', width: 5 },
      { key: 'actionsCorrectHumanTask', header: 'CorrectHumanTask', width: 5 },
      { key: 'actionsCorrectDualTaskHumanPart', header: 'CorrectDualTaskHumanPart', width: 5 },
      { key: 'actionsCreateAlert', header: 'CreateAlert', width: 5 },
      { key: 'actionsBreakpoint', header: 'Breakpoint', width: 5 },
    ]
    worksheet.columns = columns;
    worksheet.getRow(2).values = worksheet.getRow(1).values;
    worksheet.getRow(1).values = [];
    worksheet.views = [{state: 'frozen', xSplit: 6, ySplit: 2}];

    function toColumnName(num) {
      for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
        ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
      }
      return ret;
    }

    function mergeCells(worksheet, from, to, name){
      let fromCell = toColumnName(from)+'1';
      let toCell = toColumnName(to)+'1';
      worksheet.mergeCells(fromCell+':'+toCell);
      worksheet.getCell(fromCell).value = name;
    }

    function mergeFirstRowColumns(worksheet, columns){
      let groupName = null;
      let groupFrom = null;
      let groupTo = null;
      columns.forEach((column, i)=>{      
        if(column.group){        
          if(groupName)
            mergeCells(worksheet, groupFrom+1, groupTo+1, groupName)        
          groupName = column.group;
          groupFrom = i;   
          groupTo = i;             
        }
        groupTo = i;  
        if(i == columns.length-1)
          mergeCells(worksheet, groupFrom+1, groupTo+1, groupName) 
      });
    }

    mergeFirstRowColumns(worksheet, columns);

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
        let dad = null
        if(file.result && file.result.derivedAttributeDefinitions)
          dad = file.result.derivedAttributeDefinitions;        
        let ed = null
        if(file.result && file.result.entityDefinitions)
          ed = file.result.entityDefinitions;
        let cd = null
        if(file.result && file.result.caseDefinition)
          cd = file.result.caseDefinition;
        let ssd = null
        if(file.result && file.result.summarySectionDefinitions)
          ssd = file.result.summarySectionDefinitions;
        let sd = null
        if(file.result && file.result.stageDefinitions)
          sd = file.result.stageDefinitions;
        let htd = null
        if(file.result && file.result.humanTaskDefinitions)
          htd = file.result.humanTaskDefinitions;
        let atd = null
        if(file.result && file.result.automatedTaskDefinitions)
          atd = file.result.automatedTaskDefinitions;
        let dtd = null
        if(file.result && file.result.dualTaskDefinitions)
          dtd = file.result.dualTaskDefinitions;
        let syd = null
        if(file.result && file.result.sentryDefinitions)
          syd = file.result.sentryDefinitions;
        let hhd = null
        if(file.result && file.result.httpHookDefinitions)
          hhd = file.result.httpHookDefinitions;
        let a = null
        if(file.result && file.result.actions)
          a = file.result.actions;

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
          derivedAttributeDefinitionsNr: dad ? dad.nr : '',
          derivedAttributeDefinitionsExplicitType: dad ? dad.explicitType : '',
          derivedAttributeDefinitionsAdditionalDescription: dad ? dad.additionalDescription : '',
          derivedAttributeDefinitionsUiReference: dad ? dad.uiReference : '',
          derivedAttributeDefinitionsUiReferenceLineDiagram: dad ? dad.uiReferenceLineDiagram : '',
          derivedAttributeDefinitionsUiReferenceColors: dad ? dad.uiReferenceColors : '',
          derivedAttributeDefinitionsUiReferenceSvg: dad ? dad.uiReferenceSvg : '',
          entityDefinitionsNr: ed ? ed.nr : '',
          entityDefinitionsAvgNrAttributeDefinitions: ed ? ed.avgNrAttributeDefinitions : '',
          entityDefinitionsAvgNrDerivedAttributeDefinitions: ed ? ed.avgNrDerivedAttributeDefinitions : '',
          caseDefinitionHasClientPath: cd ? cd.hasClientPath : '',
          caseDefinitionHasOwnerPath: cd ? cd.hasOwnerPath : '',
          caseDefinitionHasNewEntityDefinitionId: cd ? cd.hasNewEntityDefinitionId : '',
          caseDefinitionHasNewEntityAttachPath: cd ? cd.hasNewEntityAttachPath : '',
          caseDefinitionHasNotesDefaultValue: cd ? cd.hasNotesDefaultValue : '',
          caseDefinitionHasOnAvailableHTTPHookURL: cd ? cd.hasOnAvailableHTTPHookURL : '',
          caseDefinitionHasOnEnableHttpHTTPHookURL: cd ? cd.hasOnEnableHttpHTTPHookURL : '',
          caseDefinitionHasOnActivateHTTPHookURL: cd ? cd.hasOnActivateHTTPHookURL : '',
          caseDefinitionHasOnCompleteHTTPHookURL: cd ? cd.hasOnCompleteHTTPHookURL : '',
          caseDefinitionHasOnTerminateHTTPHookURL: cd ? cd.hasOnTerminateHTTPHookURL : '',
          caseDefinitionHasOnDeleteHTTPHookURL: cd ? cd.hasOnDeleteHTTPHookURL : '',
          summarySectionDefinitionsNr: ssd ? ssd.nr : '',
          summarySectionDefinitionsAvgNrSummaryParamDefinitions: ssd ? ssd.avgNrSummaryParamDefinitions : '',
          summarySectionDefinitionsPositionLeft: ssd ? ssd.positionLeft : '',
          summarySectionDefinitionsPositionCenter: ssd ? ssd.positionCenter : '',
          summarySectionDefinitionsPositionRight: ssd ? ssd.positionRight : '',
          summarySectionDefinitionsPositionStretched: ssd ? ssd.positionStretched : '',
          stageDefinitionsNr: sd ? sd.nr : '',
          stageDefinitionsOwnerPath: sd ? sd.ownerPath : '',
          stageDefinitionsRepeatableOnce: sd ? sd.repeatableOnce : '',
          stageDefinitionsRepeatableSerial: sd ? sd.repeatableSerial : '',
          stageDefinitionsRepeatableParallel: sd ? sd.repeatableParallel : '',
          stageDefinitionsIsMandatory: sd ? sd.isMandatory : '',
          stageDefinitionsActivationAutomatic: sd ? sd.activationAutomatic : '',
          stageDefinitionsActivationManual: sd ? sd.activationManual : '',
          stageDefinitionsActivationExpression: sd ? sd.activationExpression : '',
          stageDefinitionsManualActivationExpression: sd ? sd.manualActivationExpression : '',
          stageDefinitionsNewEntityDefinition: sd ? sd.newEntityDefinition : '',
          stageDefinitionsNewEntityAttachPath: sd ? sd.newEntityAttachPath : '',
          stageDefinitionsExternalId: sd ? sd.externalId : '',
          stageDefinitionsDynamicDescriptionPath: sd ? sd.dynamicDescriptionPath : '',
          stageDefinitionsAvgNrHumanTaskDefinitions: sd ? sd.avgNrHumanTaskDefinitions : '',
          stageDefinitionsAvgNrAutomatedTaskDefinitions: sd ? sd.avgNrAutomatedTaskDefinitions : '',
          stageDefinitionsAvgNrDualTaskDefinitions: sd ? sd.avgNrDualTaskDefinitions : '',
          stageDefinitionsAvgNrSentryDefinitions: sd ? sd.avgNrSentryDefinitions : '',
          stageDefinitionsAvgNrHttpHookDefinitions: sd ? sd.avgNrHttpHookDefinitions : '',
          humanTaskDefinitionsNr: htd ? htd.nr : '',
          humanTaskDefinitionsOwnerPath: htd ? htd.ownerPath : '',
          humanTaskDefinitionsRepeatableOnce: htd ? htd.repeatableOnce : '',
          humanTaskDefinitionsRepeatableSerial: htd ? htd.repeatableSerial : '',
          humanTaskDefinitionsRepeatableParallel: htd ? htd.repeatableParallel : '',
          humanTaskDefinitionsIsMandatory: htd ? htd.isMandatory : '',
          humanTaskDefinitionsActivationAutomatic: htd ? htd.activationAutomatic : '',
          humanTaskDefinitionsActivationManual: htd ? htd.activationManual : '',
          humanTaskDefinitionsActivationExpression: htd ? htd.activationExpression : '',
          humanTaskDefinitionsManualActivationExpression: htd ? htd.manualActivationExpression : '',
          humanTaskDefinitionsNewEntityDefinition: htd ? htd.newEntityDefinition : '',
          humanTaskDefinitionsNewEntityAttachPath: htd ? htd.newEntityAttachPath : '',
          humanTaskDefinitionsExternalId: htd ? htd.externalId : '',
          humanTaskDefinitionsDynamicDescriptionPath: htd ? htd.dynamicDescriptionPath : '',
          humanTaskDefinitionsFootnote: htd ? htd.footnote : '',
          humanTaskDefinitionsAvgNrTaskParamDefinitions: htd ? htd.avgNrTaskParamDefinitions : '',
          humanTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory: htd ? htd.avgNrTaskParamDefinitionsIsMandatory : '',
          humanTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly: htd ? htd.avgNrTaskParamDefinitionsIsReadOnly : '',
          humanTaskDefinitionsAvgNrSentryDefinitions: htd ? htd.avgNrSentryDefinitions : '',
          humanTaskDefinitionsAvgNrHttpHookDefinitions: htd ? htd.avgNrHttpHookDefinitions : '',
          humanTaskDefinitionsDueDatePath: htd ? htd.dueDatePath : '',
          automatedTaskDefinitionsNr: atd ? atd.nr : '',
          automatedTaskDefinitionsOwnerPath: atd ? atd.ownerPath : '',
          automatedTaskDefinitionsRepeatableOnce: atd ? atd.repeatableOnce : '',
          automatedTaskDefinitionsRepeatableSerial: atd ? atd.repeatableSerial : '',
          automatedTaskDefinitionsRepeatableParallel: atd ? atd.repeatableParallel : '',
          automatedTaskDefinitionsIsMandatory: atd ? atd.isMandatory : '',
          automatedTaskDefinitionsActivationAutomatic: atd ? atd.activationAutomatic : '',
          automatedTaskDefinitionsActivationManual: atd ? atd.activationManual : '',
          automatedTaskDefinitionsActivationExpression: atd ? atd.activationExpression : '',
          automatedTaskDefinitionsManualActivationExpression: atd ? atd.manualActivationExpression : '',
          automatedTaskDefinitionsNewEntityDefinition: atd ? atd.newEntityDefinition : '',
          automatedTaskDefinitionsNewEntityAttachPath: atd ? atd.newEntityAttachPath : '',
          automatedTaskDefinitionsExternalId: atd ? atd.externalId : '',
          automatedTaskDefinitionsDynamicDescriptionPath: atd ? atd.dynamicDescriptionPath : '',
          automatedTaskDefinitionsFootnote: atd ? atd.footnote : '',
          automatedTaskDefinitionsAvgNrTaskParamDefinitions: atd ? atd.avgNrTaskParamDefinitions : '',
          automatedTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory: atd ? atd.avgNrTaskParamDefinitionsIsMandatory : '',
          automatedTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly: atd ? atd.avgNrTaskParamDefinitionsIsReadOnly : '',
          automatedTaskDefinitionsAvgNrSentryDefinitions: atd ? atd.avgNrSentryDefinitions : '',
          automatedTaskDefinitionsAvgNrHttpHookDefinitions: atd ? atd.avgNrHttpHookDefinitions : '',
          automatedTaskDefinitionsAutomaticCompleteOnPath: atd ? atd.automaticCompleteOnPath : '',
          dualTaskDefinitionsNr: dtd ? dtd.nr : '',
          dualTaskDefinitionsOwnerPath: dtd ? dtd.ownerPath : '',
          dualTaskDefinitionsRepeatableOnce: dtd ? dtd.repeatableOnce : '',
          dualTaskDefinitionsRepeatableSerial: dtd ? dtd.repeatableSerial : '',
          dualTaskDefinitionsRepeatableParallel: dtd ? dtd.repeatableParallel : '',
          dualTaskDefinitionsIsMandatory: dtd ? dtd.isMandatory : '',
          dualTaskDefinitionsActivationAutomatic: dtd ? dtd.activationAutomatic : '',
          dualTaskDefinitionsActivationManual: dtd ? dtd.activationManual : '',
          dualTaskDefinitionsActivationExpression: dtd ? dtd.activationExpression : '',
          dualTaskDefinitionsManualActivationExpression: dtd ? dtd.manualActivationExpression : '',
          dualTaskDefinitionsNewEntityDefinition: dtd ? dtd.newEntityDefinition : '',
          dualTaskDefinitionsNewEntityAttachPath: dtd ? dtd.newEntityAttachPath : '',
          dualTaskDefinitionsExternalId: dtd ? dtd.externalId : '',
          dualTaskDefinitionsDynamicDescriptionPath: dtd ? dtd.dynamicDescriptionPath : '',
          dualTaskDefinitionsFootnote: dtd ? dtd.footnote : '',
          dualTaskDefinitionsAvgNrTaskParamDefinitions: dtd ? dtd.avgNrTaskParamDefinitions : '',
          dualTaskDefinitionsAvgNrTaskParamDefinitionsIsMandatory: dtd ? dtd.avgNrTaskParamDefinitionsIsMandatory : '',
          dualTaskDefinitionsAvgNrTaskParamDefinitionsIsReadOnly: dtd ? dtd.avgNrTaskParamDefinitionsIsReadOnly : '',
          dualTaskDefinitionsAvgNrSentryDefinitions: dtd ? dtd.avgNrSentryDefinitions : '',
          dualTaskDefinitionsAvgNrHttpHookDefinitions: dtd ? dtd.avgNrHttpHookDefinitions : '',
          dualTaskDefinitionsDueDatePath: dtd ? dtd.dueDatePath : '',
          dualTaskDefinitionsAutomaticCompleteOnPath: dtd ? dtd.automaticCompleteOnPath : '',
          dualTaskDefinitionsAvgNrTaskParamDefinitionsHumanPart: dtd ? dtd.avgNrTaskParamDefinitionsHumanPart : '',
          dualTaskDefinitionsAvgNrTaskParamDefinitionsAutomatedPart: dtd ? dtd.avgNrTaskParamDefinitionsAutomatedPart : '',
          sentryDefinitionsNr: syd ? syd.nr : '',
          sentryDefinitionsAvgNrPreconditions: syd ? syd.avgNrPreconditions : '',
          sentryDefinitionsAvgNrExpressionsPerPrecondition: syd ? syd.avgNrExpressionsPerPrecondition : '',
          httpHookDefinitionsNr: hhd ? hhd.nr : '',
          httpHookDefinitionsMethodGET: hhd ? hhd.methodGET : '',
          httpHookDefinitionsMethodPOST: hhd ? hhd.methodPOST : '',
          httpHookDefinitionsMethodPUT: hhd ? hhd.methodPUT : '',
          httpHookDefinitionsMethodDEL: hhd ? hhd.methodDEL : '',
          httpHookDefinitionsFailureMessage: hhd ? hhd.failureMessage : '',
          httpHookDefinitionsOnAvailable: hhd ? hhd.onAvailable : '',
          httpHookDefinitionsOnEnable: hhd ? hhd.onEnable : '',
          httpHookDefinitionsOnActivate: hhd ? hhd.onActivate : '',
          httpHookDefinitionsOnComplete: hhd ? hhd.onComplete : '',
          httpHookDefinitionsOnTerminate: hhd ? hhd.onTerminate : '',
          httpHookDefinitionsOnActivateHumanPart: hhd ? hhd.onActivateHumanPart : '',
          httpHookDefinitionsOnCompleteHumanPart: hhd ? hhd.onCompleteHumanPart : '',
          httpHookDefinitionsOnActivateAutomatedPart: hhd ? hhd.onActivateAutomatedPart : '',
          httpHookDefinitionsOnCompleteAutomatedPart: hhd ? hhd.onCompleteAutomatedPart : '',
          actionsNr: a ? a.nr : '',
          actionsActivateStage: a ? a.activateStage : '',
          actionsCompleteStage: a ? a.completeStage : '',
          actionsActivateHumanTask: a ? a.activateHumanTask : '',
          actionsActivateDualTask: a ? a.activateDualTask : '',
          actionsCompleteHumanTask: a ? a.completeHumanTask : '',
          actionsCompleteAutomatedTask: a ? a.completeAutomatedTask : '',
          actionsCompleteDualTaskHumanPart: a ? a.completeDualTaskHumanPart : '',
          actionsCompleteDualTaskAutomatedPart: a ? a.completeDualTaskAutomatedPart : '',
          actionsCorrectHumanTask: a ? a.correctHumanTask : '',
          actionsCorrectDualTaskHumanPart: a ? a.correctDualTaskHumanPart : '',
          actionsCreateAlert: a ? a.createAlert : '',
          actionsBreakpoint: a ? a.breakpoint : '',
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
      worksheet.getCell('E'+from).alignment = {vertical:'middle'}; //, wrapText: true};
    }
    
  }

  async writeFile(filename){
    console.log('save as *.xlsx')
    await this.workbook.xlsx.writeFile(filename+'.xlsx');
  }

  

 

}




