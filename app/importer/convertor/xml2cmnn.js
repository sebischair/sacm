var xml2js = require('xml2js');
var Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const xml2jspromise = Promise.promisifyAll(xml2js);


XML2CMNN('../', 'studyrelease.case.groningen.cs1.xml');
XML2CMNN('../', 'studyrelease.case.groningen.cs2.xml');
XML2CMNN('../', 'studyrelease.case.leida.cs1.xml');
XML2CMNN('../', 'studyrelease.case.leida.cs2.xml');
XML2CMNN('../', 'studyrelease.case.israel.cs1.xml');
XML2CMNN('../', 'studyrelease.case.israel.cs2.xml');
XML2CMNN('../', 'studyrelease.case.barcelona.cs1.xml');
XML2CMNN('../', 'studyrelease.case.barcelona.cs2.xml');

function XML2CMNN(sourcePath, sourceFileName){
  var sourcefilePath = sourcePath + sourceFileName;
  return xml2jspromise.parseStringAsync(fs.readFileSync(sourcefilePath).toString(), {explicitChildren:true, preserveChildrenOrder:true})
  .then(xml=>{
    var stageDefinitions = xml.SACMDefinition.Workspace[0].CaseDefinition[0].StageDefinition;
    var content = "Created at: "+new Date().toISOString() +' \n';
    for(var i=0; i< stageDefinitions.length; i++ ){
      var stageDefinition = stageDefinitions[i]
      content += '\n'+printElement('StageDefinition', stageDefinition)
      if(stageDefinition.SentryDefinition)
        content += addSentryDefinition(stageDefinition);
      var children = stageDefinition.$$;
      for(var j=0; j< children.length; j++){
        var td = children[j];
        let isHumanTaskDefinition = td['#name']=='HumanTaskDefinition';
        let isAutomatedTaskDefinition = td['#name']=='AutomatedTaskDefinition';
        let isDualTaskDefinition = td['#name']=='DualTaskDefinition';
        if(isHumanTaskDefinition || isAutomatedTaskDefinition || isDualTaskDefinition){
          content += printElement(td['#name'], td)
        }
      }

    }
    console.log(content);
    fs.writeFileSync(sourceFileName+'.cmnn', content);
    return Promise.resolve(content);
  })
}

function printElement(type, elem){
  return '['+type+']\t' + ' ' + elem.$.id + ' | ' + elem.$.description + '\n';
}

function addSentryDefinition(elem){    
  if(elem.SentryDefinition){
    for(var i=0; i<elem.SentryDefinition.length; i++){
      var sentryDefinition = elem.SentryDefinition[i];
      var content = '--[SentryDefinition]\t ';
      console.log('i'+i)
      if(sentryDefinition.precondition){
        for(var j=0; j<sentryDefinition.precondition.length; j++){
          console.log('j'+j)
          content += sentryDefinition.precondition[j].$.processDefinitionId;
          if(sentryDefinition.precondition.length-1 != j)
            content +=', ';
        }        
      }
      content += '\n'
    }
  }
  console.log(content)
  return content;
}
 