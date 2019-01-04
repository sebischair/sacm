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
    content += "[ElementName] Repeatable | Mandatory | Activation | HttpHookDefinition | Name | Description \n"
    content += "-------------------------------------------------------------------------------\n"
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
          if(td.SentryDefinition)
            content += addSentryDefinition(td);
        }
      }

    }
    console.log(content);
    fs.writeFileSync(sourceFileName+'.cmnn', content);
    return Promise.resolve(content);
  })
}

function printElement(type, elem){
  var repeatable = elem.$.repeatable? elem.$.repeatable.substring(0,1) : '';
  var mandatory = elem.$.isMandatory === 'true'? 'T': 'F';
  var activation  = !elem.$.activation? 'A': elem.$.activation.substring(0,1);
  var HttpHookDefinition = elem.HttpHookDefinition? 'T': 'F';
  return '['+type+'] '+repeatable+ ' | '+mandatory+ ' | ' + activation + ' | ' +HttpHookDefinition+ ' | ' + elem.$.id + ' | ' + elem.$.description + '\n';
}

function addSentryDefinition(elem){    
  if(elem.SentryDefinition){
    var content = ''
    for(var i=0; i<elem.SentryDefinition.length; i++){
      var sentryDefinition = elem.SentryDefinition[i];
      content += '--[SentryDefinition]\t ';
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
 