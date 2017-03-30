import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const CaseDefinitionSchema = new mongoose.Schema({
  name: String,
});

CaseDefinitionSchema.post('remove', function(doc) {
  return ProcessDefinition.findByCaseDefinitionId(doc._id).then(processDefs=>{
    return Promise.map(processDefs, processDef=>{
      return processDef.remove();
    });
  });
});

CaseDefinitionSchema.statics.calcCaseDefTree = caseDefId=>{
  new Promise((resolve, reject)=>{
    CaseDefinition.findById(caseDefId)
      .then(caseDef=>{
        console.log(caseDef)
        return [caseDef, ProcessDefinition.findByCaseDefinitionId(caseDefId)];
      })
      .spread((caseDef, processDefs)=>{
        console.log('heer');
        console.log(caseDef);
        console.log(processDefs); 
        resolve(caseDef);       
      })
      .catch(err=>{
        reject(err);
      });
  })


}

let CaseDefinition = mongoose.model('CaseDefinition', CaseDefinitionSchema)


export default CaseDefinition;