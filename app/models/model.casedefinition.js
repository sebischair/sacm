import mongoose from 'mongoose';
import ProcessDefinition from './model.processdefinition';
import Promise from 'bluebird';
const ObjectId = mongoose.Schema.Types.ObjectId;


const CaseDefinitionSchema = new mongoose.Schema({
  name: String,
  __v: { type: Number, select: false}
});

CaseDefinitionSchema.post('remove', function(doc) {
  return ProcessDefinition.findByCaseDefinitionId(doc._id).then(processDefs=>{
    return Promise.map(processDefs, processDef=>{
      return processDef.remove();
    });
  });
});

CaseDefinitionSchema.statics.calcCaseDefTree = caseDefId=>{
  return new Promise((resolve, reject)=>{
    CaseDefinition.findById(caseDefId).lean()
      .then(caseDef=>{
        return [caseDef, ProcessDefinition.findByCaseDefinitionId(caseDefId).lean()];
      })
      .spread((caseDef, processDefs)=>{
        const map = new Map();
        processDefs.forEach(p=>{
          if(map.has(p.parent+''))
            map.get(p.parent+'').push(p);
          else
            map.set(p.parent+'', [p]);
        });     
        caseDef.processes = calcTree(map.get(null+''), map);
        resolve(caseDef);       
      })
      .catch(err=>{
        reject(err);
      });
  })

  function calcTree(rootProcesses, processParentMap){
    if(rootProcesses == null)
      return [];
    return rootProcesses.map(p => {
      if(processParentMap.has(p._id+'')) {     
        let children = processParentMap.get(p._id+'');
        p.children = calcTree(children, processParentMap);
      }
      return p;
    });
  };


}

let CaseDefinition = mongoose.model('CaseDefinition', CaseDefinitionSchema)


export default CaseDefinition;