import mongoose from 'mongoose';
import ProcessDefinition from './processdefinition';
const ObjectId = mongoose.Schema.Types.ObjectId;


const CaseDefinitionSchema = new mongoose.Schema({
  name: String,
});

CaseDefinitionSchema.post('remove', function(doc, next) {
  console.log('%s has been removed', doc._id);
  console.log(doc);
  ProcessDefinition.find({caseDefinition: doc._id})
    .than(cds=>{
      console.log(cds.length);
      return Promise.forEach(cds, cd=>{
        return pd.remove();
      });    
    })
    .than(()=>{
      next();
    });
});

let CaseDefinition = mongoose.model('CaseDefinition', CaseDefinitionSchema)


export default CaseDefinition;